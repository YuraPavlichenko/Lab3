<template>
  <div id="app">
    <button v-on:click="to_main" type="button" class = "double-border-button">Головна</button>
    <div v-if="status == 'main'">
      <button v-on:click="to_append_driver" type="button" class = "double-border-button">Додати водія</button>
      <button v-on:click="to_append_driver_mark" type="button" class = "double-border-button">Поставити оцінку</button>
      <button v-on:click="to_list_drivers" type="button" class = "double-border-button">Список водіїв</button>
      <button v-on:click="to_find_driver" type="button" class = "double-border-button">Знайти водія</button>
    </div>
    <div v-else-if="status == 'append_driver'">
      <form onsubmit="return false;">
        <label for="exampleInputEmail1" class="superClass">ПІБ</label>
        <input type="text" id="exampleInputEmail1" aria-describedby="emailHelp" v-model="append_driver_data[0]" placeholder="Введіть ПІБ" ref="pib" class="form-control">

        <label for="exampleInputEmail1" class="superClass">Email</label>
        <input type="email" id="exampleInputEmail1" aria-describedby="emailHelp" v-model="append_driver_data[1]" placeholder="Введіть Email" ref="pib" class="form-control">

        <label for="exampleInputEmail1" class="superClass">Телефон</label>
        <input type="number" id="exampleInputEmail1" aria-describedby="emailHelp" v-model="append_driver_data[2]" placeholder="Введіть номер телефону" ref="pib" class="form-control">
        
        <label for="exampleFormControlTextarea1" class="superClass">Інформація</label>
        <textarea type="text" v-model="append_driver_data[3]" class="form-control" id="exampleFormControlTextarea1" rows="3" placeholder="Введіть інформацію про водія"></textarea>

        <input v-on:click="send_data" type="submit" value="Ok" class="double-border-button">
      </form>
    </div>

    <div v-else-if="status == 'append_driver_mark'">
      <select v-model="select_driver" class="input1"> 
        <option value="" disabled selected>Вибрати водія</option>
        <option v-for="item in drivers_arr" :key="item" v-bind:value="item">
          {{item}}
        </option>
        
        
      </select>

      <input type="range" min="0" max="10" id="customRange2" v-model="you_mark" class="input1">
        <h1 align="center">{{you_mark}}</h1>
        
      <label for="exampleFormControlTextarea1" class="superClass">Відгук</label>
      <textarea ref="you_resp" v-model="you_text" class="form-control" id="exampleFormControlTextarea2" rows="3" placeholder="Введіть свій відгук" ></textarea>


      <input  v-on:click="send_response" type="submit" value="Ok" class="input1">
    </div>
    
    <div v-else-if="status == 'list_drivers'">

      <ol v-if="list_drivers" class="rounded">
        <li v-for="item in list_drivers" :key="item" align="center">
          <a href="#">{{item.star.toFixed(2)}} star, {{item.pib}}, phone - {{item.phone}}, {{item.email}}, {{item.info}}</a>
        </li>
      </ol>

    </div>
    <div v-else-if="status == 'find_driver'">
       <select v-model="select_driver" class="input1"> 
        <option value="" disabled selected>Вибрати водія</option>
        <option v-for="item in drivers_arr" :key="item" v-bind:value="item">
          {{item}}
        </option>
      </select>
      <button v-on:click="get_driver_info" class="input1">Інформація</button>
      <p></p>
      <div v-if="one_driver != null" class="input2">
        {{one_driver.pib}}, {{one_driver.email}}, phone - {{one_driver.phone}}, {{one_driver.info}}
        <ul>
          <li v-for="item in one_driver.marks.length" :key="item">
            {{one_driver.dates[item-1]}}, {{one_driver.marks[item-1]}} star:: {{one_driver.resps[item-1]}}
          </li>
        </ul>
      </div>
    </div>
    <div v-else>
      error!
    </div>
  </div>
</template>
<!--

  status = main, append_driver, append_driver_mark, list_drivers, find_driver
  
 -->
<script>
import axios from 'axios'
function compare( a, b ) {
  if ( a.star > b.star ){
    return -1;
  }
  if ( a.star < b.star ){
    return 1;
  }
  return 0;
}
export default {
  name: 'app',
  data () {
    return {
      server: 'http://localhost:3000/',
      status: "main",
      append_driver_data: Array(4), // дані відправки форми
      drivers_arr: Array(),  // список водіїв для вибору зі списку)
      list_drivers: Array(), // рейтинг
      select_driver: '', // вибраний водій
      you_mark: 5, // оцінка водія
      you_text: '', // ваш відгук
      one_driver: null
    }
  },
  methods:{
    to_main(){
      this.status = "main";
      this.select_driver = '';
      this.you_text = '';
      this.you_mark = 5;
      this.drivers_arr = new Array();
      this.one_driver = null;
    },
    to_find_driver(){
      axios.get(this.server+'drivers').then((response) => { 
        for(let i=0;i<response.data.length;i++){
          this.drivers_arr.push(response.data[i]); 
        }
      },err => alert('server eror'));
      this.status = "find_driver";
    },
    get_driver_info(){
      axios.post(this.server+'find_one_drivers', {
        pib: this.select_driver
      }).then((response) => { 
        this.one_driver = response.data;
      },err => alert('server eror'));
    },
    to_append_driver(){
      this.status = "append_driver";
    },
    to_append_driver_mark(){
      axios.get(this.server+'drivers').then((response) => { 
        for(let i=0;i<response.data.length;i++){
          this.drivers_arr.push(response.data[i]); 
        }
      },err => alert('server eror'));
      this.status = "append_driver_mark";
    },
    to_list_drivers(){
      axios.get(this.server+'drivers_list').then((response) => { 
        this.list_drivers =  response.data;
        this.list_drivers.sort(compare);
      },err => alert('server eror'));
      this.status = "list_drivers";
    },
    send_data(){
      if(this.append_driver_data[0] != null && this.append_driver_data[1] != null && this.append_driver_data[2] != null && this.append_driver_data[3] != null){
        axios.post(this.server+'drivers', {
          pib: this.append_driver_data[0],
          email: this.append_driver_data[1],
          phone: this.append_driver_data[2],
          info: this.append_driver_data[3]
        }).then((response) => {
            console.log("OK");
          }, (error) => {
            console.log(error);
        },err => alert('server eror'));  
        this.append_driver_data = new Array(4);
      }
      else{
        this.$refs.pib.focus();
      }
    },
    send_response(){
      if(this.select_driver != '' &&  this.you_text != '' ){
        axios.post(this.server+'drivers_resp', {
          driver: this.select_driver,
          mark: this.you_mark,
          text: this.you_text
        }).then((response) => {
            console.log("OK");
          },err => alert('server error'));  
        this.you_text = '';
      }
      else{
        this.$refs.you_resp.focus();
      }
    }
  }
}
</script>


<style>

body{
  background-image: url(cars.png);
}

.double-border-button {
  text-decoration: none;
  display: inline-block;
  padding: 10px 30px;
  position: relative;
  border: 3px solid #d5b18e;
  color: #d5b18e;
  font-family: 'Montserrat', sans-serif;
  transition: .4s;
  display: block;
  margin: 55px auto;
  font-size: 40px;
}
.double-border-button:after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  margin: auto;
  border: 3px solid rgba(0, 0, 0, 0);
  transition: .4s;
}
.double-border-button:hover:after {
  border-color: #d5b18e;
  width: calc(100% - 10px);
  height: calc(100% + 20px);
}

.input1{
  display: block;
  margin: 20px auto;
  background-color: #efefef;
  color: #d5b18e;
  height: 40px;
}

.form-control{
  width: 300px;
  margin-left: 615px;
}

.superClass{
  margin-left: 615px;
}

.input2{
  display: block;
  margin: 20px auto;
  color: #695209;
  height: 20px;
  font-size: 25px;
  margin-left: 450px;
}

.rounded {
counter-reset: li; 
list-style: none; 
font: 14px "Trebuchet MS", "Lucida Sans";
padding: 0;
text-shadow: 0 1px 0 rgba(255,255,255,.5);
width: 1000px;
margin: auto;
}
.rounded a {
position: relative;
display: block;
padding: .4em .4em .4em 2em;
margin: .5em 0;
background: #DAD2CA;
color: #444;
text-decoration: none;
border-radius: .3em;
transition: .3s ease-out;
}
.rounded a:hover {background: #E9E4E0;}

.rounded a:hover:before {transform: rotate(360deg);}

.rounded a:before {
content: counter(li);
counter-increment: li;
position: absolute;
left: -1.3em;
top: 50%;
margin-top: -1.3em;
background: #8FD4C1;
height: 2em;
width: 2em;
line-height: 2em;
border: .3em solid white;
text-align: center;
font-weight: bold;
border-radius: 2em;
transition: all .3s ease-out;
}

</style>
