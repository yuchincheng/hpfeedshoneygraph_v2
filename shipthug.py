import os
import sys
import time
import datetime
import json
import logging
import hpfeeds
import thugxmlparser
import functions

HOST        = 'hpfeeds.honeycloud.net'
PORT        = 10000
CHANNELS    = ['thug.events', 'thug.files',]
IDENT       = 'YOUR IDENT'
SECRET      = 'YOUR SECRET'

OUTFILE     = './logs/thugevents.log'
OUTDIR      = './logs/thugevents/'
log       = logging.getLogger("thug.events")
handler   = logging.FileHandler(OUTFILE)
formatter = logging.Formatter('[%(asctime)s] [%(levelname)s] %(message)s')
handler.setFormatter(formatter)
log.addHandler(handler)
log.setLevel(logging.INFO)

thugOUTFILE     = './logs/thugfiles.log'
thugOUTDIR      = './logs/thugdownload/'
logthug      =  logging.getLogger("thug.files")
handlerthug   = logging.FileHandler(thugOUTFILE )
formatterthug = logging.Formatter('[%(asctime)s] [%(levelname)s] %(message)s')
handlerthug.setFormatter(formatterthug)
logthug.addHandler(handlerthug)
logthug.setLevel(logging.INFO)

class ThugEvents:
    def __init__(self):
        if not os.path.exists(OUTDIR): 
            os.mkdir(OUTDIR)
        if not os.path.exists(thugOUTDIR):
            os.mkdir(thugOUTDIR)

    def run(self):
        def on_message(identifier, channel, payload):
            if channel == 'thug.events':
                fpath = os.path.join(OUTDIR, str(time.strftime("%Y%m%d-%H%M%S", time.gmtime())+".xml")) 
                with open(fpath, 'wb') as fd:
                    fd.write(payload)
                    
                sd = functions.getthugevents(payload)
                
                if str(sd) != '{}':
                    #log.info(len(str(sd)))
                    log.info(str(sd))
                    functions.jsonsend("localhost", 9999, json.dumps(sd))
                else:
                    log.info("cannot send sd to logstash: sd={}")
                
            if channel == 'thug.files':
                try:
                    decoded = json.loads(str(payload))
                except: 
                    decoded = {'raw': payload}

                sd = functions.getthugfiles(decoded, thugOUTDIR)
                
                if str(sd) != '{}' :
                    logthug.info(str(sd))
                    functions.jsonsend("localhost", 9999, json.dumps(sd))
               

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
        f = ThugEvents()
        f.run()
    except KeyboardInterrupt:
        sys.exit(0)

