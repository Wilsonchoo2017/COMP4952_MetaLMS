import namor from 'namor'
import API from "../../../api";


export default function getData() {
  return API.getAllLo().then(function(data) {
    console.log(data)
    let list = []
    data.map((el, idx) => {
      let temp = {}
      console.log(el)
      // set up table column
      temp['title'] = el.title
      temp['type'] = el.documentType
      temp['owner'] = "TBA"
      temp['LoId'] = el.LOId
      list.push(temp)
    })
    return list
  })

}


