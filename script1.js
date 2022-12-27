// (() => {
//     console.log("start");
//     let p = Promise.resolve(10);
//     setTimeout(() => {
//         console.log("timeout 1 fired");
//     }, 0);
//     p.then(v => console.log("p resolved to " + v));
//     setTimeout(() => {
//         console.log("timeout 2 fired");
//     }, 0);
//
//     let rf = 0;
//     let np = new Promise((resolve, reject) => {
//         console.log("np's creator callback called");
//         rf = resolve;
//     });
//     np.then(v => console.log("np resolved to " + v));
//     console.log("1. np's rf = ", rf);
//     setTimeout(() => {
//         console.log("timeout 3 fired");
//         console.log("2. np's rf = ", rf);
//     }, 0);
//     p.then(v => {
//         console.log("p resolved again to " + v);
//         rf(v*v);
//     })
//     console.log("somethings to be done here.");
// })()
//
// function MyPromise(callback){
//     var resolvedValue = null;
//     var isResolved = false;
//
//     function resovle(value) {
//         resolvedValue = value;
//         isResolved = true;
//     }
//
//     callback(resovle);
//
//     this.then = function(finalCallback) {
//         if (isResolved) {
//             queueMicrotask(() => {
//                 finalCallback(resolvedValue);
//             })
//         }
//     }
// }
//
// var myP = new MyPromise((resolve) => {
//     console.log('111')
//     resolve('333');
// })
// myP.then(r => console.log(r));
// console.log('2')
//
//
// console.log(1);
//
// setTimeout(() => console.log(2));
//
// Promise.resolve().then(() => console.log(3));
//
// Promise.resolve().then(() => setTimeout(() => console.log(4)));
//
// Promise.resolve().then(() => console.log(5));
//
// setTimeout(() => console.log(6));
//
// console.log(7);

Promise.resolve().then(function () {
    setTimeout(function () {
        console.log('from promise one');
    }, 0);
}).then(() => {
    console.log('from promise two');
});

setTimeout(function () {
    console.log('from timeout');
}, 0);