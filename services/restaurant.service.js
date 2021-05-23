
const doAddItemService=function(){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log("Async Work Complete");
          resolve();
        }, 2000);
      })
    }

    module.exports={
        doAddItemService,
    }