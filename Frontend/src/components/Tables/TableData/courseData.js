import namor from 'namor'
import API from "../../../api";


export default function getData() {
  return API.getAllCourse().then(function(data) {
    console.log(data)
    let list = []
    data.map((el, idx) => {
      let temp = {}
      console.log(el)
      temp['courseId'] = el.CourseId
      temp['courseCode'] = el.CourseCode
      temp['courseName'] = el.CourseName
      temp['term'] = el.Term
      temp['year'] = el.Year
      list.push(temp)
    })
    return list
  })

}


