import GetFeed from '../utils/service'

const flickrConfig = new GetFeed('flickrConfig', '../assets/conf/flickr.json').getFeed()
const flickrFeed = flickrConfig
  .then(data => {
    // TODO modernized string template
    return new GetFeed('flickrData', 'https://api.flickr.com/services/rest/?method=flickr.people.getPhotos&api_key=' +
      data.access_token + '&user_id=' +
      data.user.id + '&format=json' +
      '&per_page=' + 10 +
      '&page=1&extras=date_upload,last_update&nojsoncallback=1').getFeed()
  }).then(data => {
    let i = 0;
    let normalizedOutput = []
    let date = ''
    let arr = data.photos

    for (i; i < arr.photo.length; i++) {
      // SEE normalize() comment above for re-use in other feeds
      let d = arr.photo[i]
      // Flickr removes last couple of zeros in timestamp
      date = new Date(parseInt(d.lastupdate + '000')).getTime()
      normalizedOutput.push({
          'title': d.title,
          'date': date,
          'embed_url': '',
          'type': 'image',
          'site_url': 'https://farm' + d.farm +
              '.staticflickr.com/' + d.server +
              '/' + d.id + '_' + d.secret + '_c.jpg',
          'image_url': 'https://farm' + d.farm +
              '.staticflickr.com/' + d.server +
              '/' + d.id + '_' + d.secret + '_c.jpg',
          'description': '',
      })
    }

    return normalizedOutput
  })

export default flickrFeed
