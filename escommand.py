import urllib2
import json
from pyelasticsearch import ElasticSearch


def querymd5(timefrom, timeto):
    query = {
        "query": {
            "filtered": {
                "query": {
                    "query_string": {
                        "query": "* AND (@type=dionaeaevents OR @type=thugevents)"
                    }
                },
                "filter": {
                    "range": {
                        "@timestamp": {
                            "from": timefrom,
                            "to": timeto
                        }
                    }
                }
            }
        },
        "fields": ["@timestamp", "startURL", "md5List"],
            "highlight": {
                "fields": {
                    "@timestamp":{},
                    "startURL": {},
                    "md5List": {}
                },
                "fragment_size": 2147483647,
                "pre_tags": [ "@start-highlight@"],
                "post_tags": [ "@end-highlight@"]
            },
            "size": 50000,
            "sort": [ {"@timestamp": { "order": "desc" } }]
    }
    return query

def esquery(query):
    es = ElasticSearch('http://localhost:9200/')
    result = es.search(query)
    return result


