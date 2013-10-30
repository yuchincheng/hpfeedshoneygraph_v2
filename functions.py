import socket
import sys
import postfile
import hashlib
import simplejson
import urllib
import urllib2
import ConfigParser
import os
import time
import json
import thugxmlparser
import datetime
from urlparse import urlparse
import logging
import hpfeeds

def getconf(section, para):
        config = ConfigParser.ConfigParser()
        config.read("general.conf")
        return config.get(section, para).strip('\'')

def getthugfiles(decoded, thugOUTDIR):
        #print "in functions:" + str(decoded)
        if 'md5' in decoded :
                #Log the event of thug.files channel into OUTFILE
                csv    = ', '.join(['{0} = {1}'.format(i, decoded[i]) for i in ['md5', 'sha1', 'type', 'url']])
                #outmsg = 'PUBLISH channel = %s, identifier = %s, %s' % (channel, identifier, csv)
                
                #Store the datastream from thug.files channel into OUTDIR with its m5sum
                filedata = decoded['data'].decode('base64')
                fpath    = os.path.join(thugOUTDIR, decoded['md5'])
                with open(fpath, 'wb') as fd:
                    fd.write(filedata)
                    
                #Send downloaded payload to virustotal. If you don't want to send to virustotal, comment the code
                APIKEY = getconf('virustotal', 'APIKEY')
                if APIKEY:
                    resjson=vt_sendscan(fpath, APIKEY)
                    #print resjson
                    
                vtresult= vt_getreport(decoded['md5'], APIKEY)
                startURL = decoded['url']
                md5list=[{'type': decoded['type'], 'md5': decoded['md5'], 'malurl':decoded['url'], 'malhostname':urlparse(startURL).hostname, \
                          'malscheme':urlparse(decoded['url']).scheme, 'vtresult':vtresult}]
            
                geoinfo = geohostname(urlparse(startURL).hostname)
                hostnamelist = [{'hostname':urlparse(startURL).hostname, 'underpath':[urlparse(startURL).path],'scheme':urlparse(startURL).scheme, 'geoinfo':geoinfo}]
            
                sd = {
                    "startURL"  : startURL,
                    "exploitList" : [],
                    "md5List"   : [x for x in md5list],
                    "urlList"   : [],
                    "hostnameList": [y for y in hostnamelist]
                }
        else:
                sd = {}
        
        return sd
        

def getthugevents(payload):
        d= thugxmlparser.xmlParser(payload)
        if d:
                startURL = thugxmlparser.startURL(d)
                if startURL!='None':
                        intime = thugxmlparser.initTime(d)
                        urllist = thugxmlparser.urlLxml(d)
                        md5list = thugxmlparser.md5Lxml(d)
                        clist = thugxmlparser.exploitxml(d)
                        hostnamelist = thugxmlparser.domaintext(startURL, clist, urllist)
                        
                        sd = {
                        #        "occurrence" : intime,
                                "startURL"  : startURL,
                                "exploitList" : [i for i in clist],
                                "md5List"   : [x for x in md5list],
                                "urlList"   : [y for y in urllist],
                                "hostnameList": [z for z in hostnamelist]
                        }
                else :
                        sd = {}
        else:
                sd = {}
        
        return sd 
                

# Ship data to central logstash via TCP/IP socket
def jsonsend(address, port, sdjson):
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        # Connect the socket to the port where the server is listening
        server_address = (address, port)
        print >>sys.stderr, 'connecting to %s port %s' % server_address
        sock.connect(server_address)
        try:
                sock.send(sdjson)
        except UnicodeDecodeError:
                print "Error"
                sock.send(sdjson.str.decode('latin1').str.encode('utf-8'))
        
        sock.close()
        #time.sleep(10)
            
def geohostname(hname):
        import GeoIP
        gi = GeoIP.open(getconf('geodb', 'geolitecity'), GeoIP.GEOIP_STANDARD)
        geoinfo = {}
        try:
                gir = gi.record_by_name(hname)
        except TypeError:
                git = None
        
        if gir == None:
                geoinfo = {'geocode':"None",'geocoutryname':"None", 'geocity':"None", 'geolat':0, 'geolon':0}
        else:
                try:
                        geoinfo = {'geocode':gir['country_code'],'geocoutryname':gir['country_name'], 'geocity':gir['city'].decode("latin1").encode("utf-8"), \
                                   'geolat':gir['latitude'], 'geolon':gir['longitude']
                        }
                except AttributeError:
                        geoinfo = {'geocode':gir['country_code'],'geocoutryname':gir['country_name'], 'geocity':gir['city'], \
                                   'geolat':gir['latitude'], 'geolon':gir['longitude']
                        }
                except UnicodeDecodeError:
                        geoinfo = {'geocode':gir['country_code'],'geocoutryname':gir['country_name'], 'geocity':gir['city'].decode("latin1").encode("utf-8"), \
                                   'geolat':gir['latitude'], 'geolon':gir['longitude']
                        }
                        
        return geoinfo


def thugfiletype(absfile):
        import re
        commres = os.popen("file " + absfile).read()
        if re.findall("Macromedia", commres, re.IGNORECASE):
                filetype = "SWF"
        elif re.findall("PDF", commres, re.IGNORECASE):
                filetype = "PDF"
        elif re.findall("PE32", commres, re.IGNORECASE):
                filetype = "PE32"
        elif re.findall("MS-DOS", commres, re.IGNORECASE):
                filetype = "MSDOS"
        else:
                filetype = "others"
                
        return filetype


def vt_sendscan(file_to_send, APIKEY):
        host = "www.virustotal.com"
        selector = "https://www.virustotal.com/vtapi/v2/file/scan"
        fields = [("apikey", APIKEY)]
        fpath = open(file_to_send, "rb").read()
        md5sum = hashlib.md5(fpath).hexdigest()
        files = [("file", md5sum, fpath)]
        response= postfile.post_multipart(host, selector, fields, files)
        
        return response

def vt_getreport(md5sum, APIKEY):
      url = "https://www.virustotal.com/vtapi/v2/file/report"
      parameters = {"resource": md5sum, "apikey":APIKEY }
      data = urllib.urlencode(parameters)
      req = urllib2.Request(url, data)
      response = urllib2.urlopen(req)
      reportobj = json.loads(response.read())
      #print reportobj
      if reportobj['response_code'] == 1:
        vt ={}
        csv=','.join(['{0}:{1}'.format(i,  reportobj['scans'][i]['result'] if i in reportobj['scans'] else 'Failure') \
        for i in ['McAfee', 'Symantec', 'Norman', 'AntiVir', 'Kaspersky', 'TrendMicro', 'Microsoft', 'Avast', 'TrendMicro', 'F-Secure']])
        
        for v in csv.split(','):
                vt.update({v.split(":")[0] : v.split(":")[1]})
        
        virustotal = {'scandate':reportobj['scan_date'], 'positives':float(reportobj['positives'])/reportobj['total'], \
                      'vtdetected':reportobj['positives'], 'vttotal':reportobj['total'], 'scans':vt }

      else:
        virustotal = {}
      
      return virustotal  


    
        
        
        
        