import axios from 'axios';

var BASE_URL = "http://localhost:8080/api/";

export function getInitialData(table, node, callback)
{
  var my_url = BASE_URL + "getinitial/" + table + "/" + node;

  axios.get(my_url)
  .then(function (response) {
    return callback(response);
  })
  .catch(function (error) {
    console.log(error);
  });

}

export function getUpdatedData(table, callback)
{
  var my_url = BASE_URL + "getupdateddata/" + table + "/";

  axios.get(my_url)
  .then(function (response) {
    return callback(response);
  })
  .catch(function (error) {
    console.log(error);
  });
}