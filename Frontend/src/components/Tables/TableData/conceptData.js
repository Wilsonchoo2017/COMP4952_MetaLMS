import API from "../../../api";


export default function getData() {
  return API.getAllConcepts().then(function(data) {
    let list = []
    for(let i = 0; i < data.length; i++) {
      let temp = {}
      temp['conceptName'] = data[i]
      list.push(temp)
    }
    return list
  })
}


