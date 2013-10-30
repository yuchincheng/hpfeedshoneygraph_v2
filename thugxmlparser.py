import xml.dom.minidom
import json
import re
import sys
import functions

#testing Usage: Read xml from a file, not from a process
def fileOpen(filename):
    docall = ''
    fd = open(filename, 'r')
    for i in fd:
        docall += i.strip()
    fd.close()
    
    return docall

def getText(nodelist):
    rc = []
    for node in nodelist:
        if node.nodeType == node.TEXT_NODE:
            rc.append(node.data)
    
    return ''.join(rc)

def xmlParser(dxml):
    try:
        d = xml.dom.minidom.parseString(dxml)
        return d
    except xml.parsers.expat.ExpatError:
        return False
    
#get md5 info {type, md5, malurl, malhostname, malscheme } from xml thugevent and vtresult from virustotal
def md5Lxml(dxml):
    from urlparse import urlparse
    def malFile(dxml):
        malfiles = []
        for n in dxml.getElementsByTagName('File_System_Object_Attributes'):
            here_type = n.getElementsByTagName('File_Type')[0].getAttribute('type')
            here_md5 = ''
            for m in n.getElementsByTagName('Hash'):
                if 'md5' == m.getAttribute('type'):
                    here_md5 = getText(m.getElementsByTagName('Hash_Value')[0].childNodes)
                    malfiles.append({'type': here_type, 'md5': here_md5})
        return malfiles
    
    md5data = malFile(dxml)
    APIKEY = functions.getconf('virustotal', 'APIKEY')
    
    for n in dxml.getElementsByTagName('Text'):
        tt = getText(n.childNodes)
        if 'URL' in tt:
            try:
                if 'MD5' in tt:
                    for post in md5data:
                        if post['md5'] == str(tt.split(' ')[6].strip(')')):
                            post['malurl'] = str(tt.split(' ')[2])
                            post['malhostname'] = urlparse(post['malurl']).hostname
                            post['malscheme'] = urlparse(post['malurl']).scheme
                            vtresult= functions.vt_getreport(post['md5'], APIKEY)
                            post['vtresult']=vtresult                
            except IndexError:
                continue
    return md5data


def initTime(dxml):
    return dxml.getElementsByTagName('Analysis')[0].getAttribute('start_datetime')

#get the starturl with http status 200 from xml thugevent
def startURL(dxml):
    starturl = 'None'
    for a in dxml.getElementsByTagName('Text'):
        tt2 = getText(a.childNodes)
        #print tt2
        if 'Status' and 'Referrer' in tt2:
            status=str(tt2.split('(Status:')[1].strip()).split(',')[0]
            URLto=str(tt2.split(' (Status:')[0]).split('URL:')[1].strip()
            URLfrom = str(tt2.split(' ')[6].strip(')')).strip()
            geturl = dxml.getElementsByTagName('Object')[0].getAttribute('object_name')
            
            if 'Status: 200, Referrer: None' in tt2:
                return URLto
            elif (status=='200') and (URLto==geturl):
                return URLfrom
            else:
                print status+" : " + geturl
                return 'None'
            
    return starturl
        

#get the urls with exploits info from xml thugevent
def exploitxml(dxml):
    clist = []
    for n in dxml.getElementsByTagName('Text'):
        tt = getText(n.childNodes)
        if 'URL Classifier' in tt:
            try:
                urlc = str(tt.split('URL:')[1].strip().split('(Rule:')[0].strip())
                rule = str(tt.split('(Rule:')[1].strip().split(',')[0])
                classification = str(tt.split('Classification:')[1].strip().strip(')'))
            except IndexError:
                continue
            
            if urlc:
                item = {'urlc': urlc, 'rule': rule, 'classification':classification}
                if item not in clist:
                    clist.append(item)
    
    return clist
    

def urlLxml(dxml):
    urllist = []
    for n in dxml.getElementsByTagName('Text'):
        tt = getText(n.childNodes)
        if 'redirection' in tt:
            try:
                redirectFrom=str(tt.split('->')[0].strip().split(' ')[-1])
            except UnicodeEncodeError or IndexError:
                continue
            
            try:
                redirectTo = str(tt.split('->')[1].strip().split(' ')[0])
            except UnicodeEncodeError or IndexError:
                continue
                  
            if redirectFrom.startswith("http") and redirectTo.startswith("http") and (not redirectFrom.endswith("://")):
                item = {'urlfrom':redirectFrom, 'urlto':redirectTo}
                if item not in urllist:
                    urllist.append(item)
        
        if 'URL' and 'Referrer' in tt :
            try:
                if 'None' not in tt:
                    URLfrom = str(tt.split(' ')[6].strip(')'))
                    URLto = str(tt.split(' ')[2].strip(')'))
                    if URLfrom.startswith("http") and URLto.startswith("http"):
                        item = {'urlfrom': URLfrom, 'urlto': URLto }
                        if item not in urllist:
                            urllist.append(item)
            except IndexError:
                continue
            
    return urllist

def check(urlstring, hlist):
    pico = 0
    from urlparse import urlparse
    if urlstring.hostname != None:
        for hitem in hlist:
            if hitem.get("hostname") == str(urlstring.hostname):
                pico = 1
                if urlstring.path not in hitem['underpath']:
                    hitem['underpath'].append(urlstring.path)

        if pico ==0 :
            geoinfo = functions.geohostname(str(urlstring.hostname))
            hlist.append ({'hostname':str(urlstring.hostname), 'underpath':[urlstring.path], 'scheme':str(urlstring.scheme) ,'geoinfo':geoinfo})
    
    return hlist


def domaintext(startURL, clist, urllist):
    from urlparse import urlparse
    hlist= []
    hlist = check(urlparse(startURL), hlist)
    
    for i in clist:
        hlist = check(urlparse(i['urlc']), hlist)
    
    for i in urllist:
        hlist= check(urlparse(i['urlfrom']), hlist)
        hlist= check(urlparse(i['urlto']), hlist)
      
    return hlist    #return hostnamelist
    

        
        



