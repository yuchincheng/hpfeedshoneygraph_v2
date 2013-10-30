#!/usr/bin/python
import os
import sys
import time
import datetime
import json
import logging
import hpfeeds
import hashlib
import functions
from urlparse import urlparse

HOST                        = 'hpfriends.honeycloud.net'
PORT                        = 20000
CHANNELS                    = ['dionaea.capture','mwbinary.dionaea.sensorunique',]
IDENT                       = 'YOUR IDENT'
SECRET                      = 'YOUR SECRET'
OUTFILE_dionaea_capture     = './logs/dionaea_capture.log'
OUTFILE                     = './logs/write_error.log'
OUTDIR 						= './logs/dionaea_malware/'

log       = logging.getLogger("dionaea.capture")
handler   = logging.FileHandler(OUTFILE_dionaea_capture)
formatter = logging.Formatter('[%(asctime)s] [%(levelname)s] %(message)s')
handler.setFormatter(formatter)
log.addHandler(handler)
log.setLevel(logging.INFO)

class HPF_CLI:
	def run(self):
		def on_message(identifier, channel, payload):
			try:
				decoded = json.loads(str(payload))
			except:
				decoded = {'raw': payload}

			if channel == 'dionaea.capture':
				csv = ', '.join(['{0} = {1}'.format(i, decoded[i]) for i in ['url', 'daddr', 'saddr', 'dport', 'sport', 'md5', 'sha512']])
				outmsg = 'PUBLISH channel = %s, identifier = %s, %s' % (channel, identifier, csv)
				log.info(outmsg)
				
				occurrence = datetime.datetime.now().isoformat()
				event={'saddr':decoded['saddr'], 'sport':decoded['sport'], 'daddr':decoded['daddr'], 'dport':decoded['dport']}
				
				APIKEY = functions.getconf('virustotal', 'APIKEY')
				vtresult= functions.vt_getreport(decoded['md5'], APIKEY)
				md5list={'md5':decoded['md5'], 'malurl':decoded['url'], 'malhostname':urlparse(decoded['url']).hostname, 'malscheme':urlparse(decoded['url']).scheme, 'vtresult':vtresult}
				
				geoinfo = functions.geohostname(urlparse(decoded['url']).hostname)
				hostnamelist = {'hostname':urlparse(decoded['url']).hostname, 'underpath':[urlparse(decoded['url']).path], 'scheme':urlparse(decoded['url']).scheme, 'geoinfo':geoinfo}
				
				sd = {
					"occurrence" : occurrence,
					"startURL"  : decoded['url'],
					"event" : event,
					"md5List" : md5list,
					"hostnameList": hostnamelist
				}
				functions.jsonsend("localhost", 8888, json.dumps(sd))
				return
			
			if channel == 'mwbinary.dionaea.sensorunique':
				md5sum = hashlib.md5(payload).hexdigest()
				fpath = os.path.join(OUTDIR, md5sum)
				try:
					with open(fpath, 'wb') as fd:
						fd.write(payload)
				except:
					outfd = open(OUTFILE, 'a')
					print >>outfd, '{0} ERROR could not write to {1}'.format(datetime.datetime.now().ctime(), fpath)
					outfd.flush()

			
		def on_error(payload):
			log.critical("Error message from server: %s" % (payload, ))
			self.hpc.stop()
		
		while True:
			try:
				self.hpc = hpfeeds.new(HOST, PORT, IDENT, SECRET)
				log.info("Connected to %s" % (self.hpc.brokername, ))
				self.hpc.subscribe(CHANNELS)
			except hpfeeds.FeedException:
				break
			
			try:
				self.hpc.run(on_message, on_error)
			except:
				self.hpc.close()
				time.sleep(20)

if __name__ == '__main__':
    try: 
        f = HPF_CLI()
        f.run()
    except KeyboardInterrupt:
        sys.exit(0)

