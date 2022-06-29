const axios = require('axios').default;



async function productget(ids){
    try {
        const getproduct = 
        axios({
            method: 'post',
            url: 'http://localhost:8001/api/list/product',
            data: {ids},
            headers: { "Content-Type": "application/json" }
            })
       
      return  (await getproduct).data?.data||[]
    } catch (error) {
        console.log(error)
    }

}
async function Userget(ids){
    try {
        const getUser = 
        axios({
            method: 'post',
            url: 'http://localhost:8000/api/userGet',
            data: {ids},
            headers: { "Content-Type": "application/json" }
            })
       
      return  (await getUser).data?.data||[]
    } catch (error) {
        console.log(error)
    }

}


module.exports ={ productget , Userget}