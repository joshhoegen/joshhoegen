// import googleFeed from './google'
import axios from 'axios'

import flickrFeed from './flickr'
import soundcloudFeed from './soundcloud'
import twitter from './twitter'
// import google from './google'

export default class Aggr {
  constructor() {
    const location = window.location.origin
    this.url = location + '/server-utils/p/proxy.php'
  }
  aggrAll() {
    return this.checkCache().then(response => {
      if (response.length) {
        return response
      }
      return Promise.all([twitter, flickrFeed, soundcloudFeed]).then(result => {
        const agr = [].concat(...result)
        // sort newest to oldest
        const json = agr.sort((a, b) => b.date.toString().localeCompare(a.date))

        this.writeCache(json)
        return json
      })
    })
  }
  checkCache() {
    return axios({
        method: 'get',
        url: this.url
      }).then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error.response.data)
        return []
      })
  }
  // TODO: Make togelable when node server setup
  writeCache(json) {
    axios({
      method: 'post',
      url: this.url,
      data: json
    })
  }
}
