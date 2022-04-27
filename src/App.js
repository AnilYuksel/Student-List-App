import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  //Fetch Api
  const [data, setData] = useState([]);
  useEffect(() => {
    const url = `https://api.hatchways.io/assessment/students`;
    axios.get(url).then((res) => {
      setData(
        res.data.students.map((student) => ({ ...student, tagName: [] }))
      );
    });
  }, []);

  const average = (grades) => grades.reduce((a, b) => a + Number(b),0) / grades.length;

  //Search by Name
  const [searched, setSearched] = useState("");
  const keys = ["firstName", "lastName"];
  // //Search by Tag
  const [tagSearched, setTagSearched] = useState("");
  //Open-Close Grades
  const [plus, setPlus] = useState(false);
  const [id, setId] = useState("");
  //Add New Tag
  const [newTag, setNewTag] = useState({});

  const handleNewTag = (tag, studentId, e) => {
    setData((prev) => {
      return prev.map((student) => {
        //check for matching student by id
        if (student.id === studentId) {
          //check if property name of tagName exists
          if (student.hasOwnProperty("tagName")) {
            return { ...student, tagName: [...student.tagName, tag] };
          } else {
            //create a new property and add the value from input
            return { ...student, tagName: [tag] };
          }
        }
        return student;
      });
    });

    //reset form input
    e.target[0].value = "";
  };


  // .filter((tag) => {
  //   if (tagSearched === "") {
  //     return tag;
  //   } else if (
  //     tag.toLowerCase().includes(tagSearched.toLowerCase())
  //   ) {
  //     return tag;
  //   }
  //   return false;
  // })

  return (
    <div className="App">
      <div className="searchBar">
        <input
          className="search"
          onChange={(e) => {
            setSearched(e.target.value.toLowerCase());
          }}
          type="search"
          placeholder="Search By Name"
        ></input>
        <input
          className="search"
          onChange={(e) => {
            setTagSearched(e.target.value);
          }}
          type="search"
          placeholder="Search By Tag"
        ></input>
      </div>
      {data
        .filter((item) =>
          keys.some((key) => item[key].toLowerCase().includes(searched)) &&
          (!!tagSearched
            ? item.tagName.some((tag) =>
                tag.toLowerCase().includes(tagSearched)
              )
            : true)
        )
        .map((item) => {
          return (
            <div key={item.id}>
              <div className="container">
                <div className="box">
                  <div className="img">
                    <img src={item.pic} alt=""></img>
                  </div>
                  <div className="info">
                    <h1>
                      {item.firstName.toUpperCase()}{" "}
                      {item.lastName.toUpperCase()}
                    </h1>
                    <p>Email: {item.email}</p>
                    <p>Company: {item.company}</p>
                    <p>Skill: {item.skill}</p>
                    <p>Average: {average(item.grades)}%</p>
                    {id === item.id && plus ? (
                      <div className="testContainer">
                        {item.grades.map((grades, i) => (
                          <div className="test" key={i}>
                            test {i + 1}: {grades}%
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div></div>
                    )}
                    <div className="tagContainer">
                      {item.tagName?.map((tag, i) => (
                        <div key={i}>
                          <p className="tag">{tag}</p>
                        </div>
                      ))}</div>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleNewTag(newTag, item.id, e);
                      }}
                    >
                      <input
                        name="tag"
                        type="text"
                        placeholder="Add a Tag"
                        onChange={(e) => {
                          setNewTag(e.target.value);
                        }}
                        className="inputTag"
                      ></input>
                      <button type="submit" className="tagButton">Submit</button>
                    </form>
                  </div>
                </div>
                <div
                  className="plus"
                  onClick={() => {
                    setPlus(!plus);
                    setId(item.id);
                  }}
                >
                  <span className="line1"></span>
                  <span
                    className={id === item.id && plus ? "active" : "line2"}
                  ></span>
                </div>
              </div>
              <hr></hr>
            </div>
          );
        })}
    </div>
  );
}
export default App;
