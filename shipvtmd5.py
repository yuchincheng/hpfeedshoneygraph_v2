import functions
import os
import json
import re
import sys
import hashlib
import escommand
import simplejson
import requests
from urlparse import urlparse

def es_getmd5(timefrom, timeto):
  malfiles = []
  q = escommand.querymd5(timefrom, timeto)
  esresult = escommand.esquery(q)
  
  for i in range(len(esresult['hits']['hits'])):
    print esresult['hits']['hits'][i]
    if esresult['hits']['hits'][i]['_type'] == "thugevents":
      if 'fields' in esresult['hits']['hits'][i]:
        if 'md5List' in esresult['hits']['hits'][i]['fields']:
          for a in esresult['hits']['hits'][i]['fields']['md5List']:
            
            if 'md5' and 'malurl' in a:
              occurrence = esresult['hits']['hits'][i]['fields']['@timestamp'].split("T")[0]
              item = {'occurrence':[occurrence], 'malurl': a['malurl'], 'channel':'thugevents' }
              pico = 0
              
              for md5item in malfiles:
                if (md5item.get("md5") == a['md5']):
                  for urlitem in md5item['malurlList']:
                    if (urlitem.get("malurl") == item['malurl']) and (occurrence not in urlitem['occurrence']) :
                      urlitem['occurrence'].append(occurrence)
                      pico = 1
                      
                  if pico != 1 :
                    md5item['malurlList'].append(item)
                    
              
              if pico == 0 :
                malfiles.append({'md5':a['md5'], 'malurlList':[item]})
                
    elif esresult['hits']['hits'][i]['_type'] =="dionaeaevents":
      if 'md5List' in esresult['hits']['hits'][i]['fields']:
        if 'md5' in esresult['hits']['hits'][i]['fields']['md5List']:
          md5sum = esresult['hits']['hits'][i]['fields']['md5List']['md5']
          malurl = esresult['hits']['hits'][i]['fields']['md5List']['malurl']
          occurrence = esresult['hits']['hits'][i]['fields']['@timestamp'].split("T")[0]
          item = {'occurrence': [occurrence], 'malurl':malurl, 'channel':'dionaeaevents'}
          pico = 0
          
          for md5item in malfiles:
            if (md5item.get("md5") == md5sum):
              for urlitem in md5item['malurlList']:
                if (urlitem.get("malurl") == item['malurl']) and (occurrence not in urlitem['occurrence']):
                  urlitem['occurrence'].append(occurrence)
                  pico = 1
                
              if pico != 1 :
                md5item['malurlList'].append(item)
                    
          if pico ==0:
            malfiles.append({'md5':md5sum, 'malurlList':[item]})
    else:
      continue
  return malfiles
          
   

def vt_private_getallinfo(malitem):
  APIKEY = functions.getconf('virustotal', 'APIKEY')
  params = {'apikey': APIKEY, 'resource':malitem, 'allinfo':1}
  response = requests.get('https://www.virustotal.com/vtapi/v2/file/report', params=params)
  reportobj = response.json()

  if reportobj['response_code'] == 1:
    
    basic = {}
    basicinfo = ','.join(['{0}:{1}'.format(i,  reportobj[i] if i in reportobj else 'Failure') \
        for i in ['size', 'type', 'first_seen', 'scan_date', 'positives', 'total']])
    
    for v in basicinfo.split(','):
      basic.update({v.split(":")[0] : v.split(":")[1]})

    scans = {}
    scaninfo=','.join(['{0}:{1}'.format(i,  reportobj['scans'][i]['result'] if i in reportobj['scans'] else 'Failure') \
              for i in ['McAfee', 'Symantec', 'Norman', 'AntiVir', 'Kaspersky', 'TrendMicro', 'Microsoft', 'Avast', 'TrendMicro', 'F-Secure']])
    
    for v in scaninfo.split(','):
      scans.update({v.split(":")[0] : v.split(":")[1]})
      
    network = {}
    if 'behaviour-v1' in reportobj['additional_info']:
      for i in reportobj['additional_info']['behaviour-v1']['network']:
        network.update({i:reportobj['additional_info']['behaviour-v1']['network'][i]})
      
    sd = {
      "md5"     : malitem,
      "basic"   : basic,
      "scans"   : scans,
      "network" : network
    }
    
    return sd

  
if __name__ == '__main__':
  sd = {}
  malfiles = es_getmd5('2013-10-30', '2013-10-30')

  for md5item in malfiles:
    
    for urlitem in md5item['malurlList']:
      geoinfo = functions.geohostname(urlparse(urlitem['malurl']).hostname)
      hostnamelist = {'hostname':urlparse(urlitem['malurl']).hostname, 'scheme':urlparse(urlitem['malurl']).scheme, 'geoinfo':geoinfo}
      urlitem.update(hostnamelist)
      
    sd.update({'malurlList': md5item['malurlList']})
    
    try:
      sdvt = vt_private_getallinfo(md5item['md5'])
      if sdvt != None :
        sd.update(sdvt)
      
      functions.jsonsend("localhost", 3333, json.dumps(sd))
    except simplejson.decoder.JSONDecodeError:
      continue
