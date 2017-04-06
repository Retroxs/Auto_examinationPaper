/**
 * Created by HUI on 2017/3/21.
 */

var number=[];
var type_number=[1,2,3,4,5]
// var pro = new Promise(function (resolve,reject) {
//     for (let i =1;i<10;i++){
//         if(i<5){
//             setTimeout(function(){
//                 number.push(0);
//                 resolve(number)
//             }, 1000);
//         }else {
//             setTimeout(function(){
//                 number.push(1);
//                 resolve(number)
//             }, 1000);
//         }
//
//     }
//
// });
// pro.then (function (num) {
//     console.log(num)
// });

for(let i=0;i<type_number.length;i++){
    number=number+type_number[i]
}
console.log(type_number)