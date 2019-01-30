import GetFeed from '../utils/service'
import flickrConfig from '../assets/conf/flickr'

const location = window.location.origin;

const flickrFeed = new GetFeed(
  'twitterData',
  `${location}/server-utils/p/twitter.php`,
)
  .getFeed()
  .then(data => {
    let i = 0
    const normalizedOutput = []
    let date = ''
    const regex = /.*?(\.)(?=\s[A-Z])/;

    for (i; i < data.length; i += 1) {
      // SEE normalize() comment above for re-use in other feeds
      const d = data[i]
      let description = d.full_text
      let img = ''
      let m
      let title = ''
      let type = 'text'

      if ((m = regex.exec(description)) !== null) {
        title = `${m[0]}`
        description = description.replace(m[0], '')
      }

      if (d.entities.media) {
        img = d.entities.media[0].media_url_https
        type = 'image'
      }

      date = new Date(d.created_at).getTime()
      normalizedOutput.push({
        title: title,
        date,
        embed_url: '',
        type: type,
        site_url: d.expanded_url,
        image_url: img,
        description: description,
      })
    }

    return normalizedOutput
  }).catch( e => {
    console.log(e)
    return []
  })

export default flickrFeed
