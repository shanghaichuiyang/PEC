<template>
 
        <div id="container">

        </div>

</template>
<script>
 import redPoint from '~/static/images/red.png' 
 import qs from 'qs'
 import {
  mapState
} from 'vuex'
export default {
  
    head:{
        script:[
            {src:"http://api.map.baidu.com/api?v=3.0&ak=jPrDoN5GpGRIBwARH7DxjPvP0ckdscuH"}  //应用v3.0版本api
        ]    
    },

    data:function(){
        return{
          map: null,
          redPoint,
          pageIndex:1,
          pageSize:10,
          points: [
                {'y':31.52,'x':117.17},
                {'y':39.55,'x':116.24},
                {'y':26.05,'x':119.18},
                {'y':23.02,'x':112.26},
                {'y':26.35,'x':106.42},
                {'y':38.02,'x':114.30},
                {'y':34.47,'x':114.21},
                {'y':22.48,'x':108.19},
             
                ]
        }
    },
    created(){
        
     
    },
    computed: {
    ...mapState('app', {
      account: 'account',
      userInfo: 'userInfo'
    }),  
  },
    methods:{
           getProject(){
           
           debugger;
           let UserID = JSON.stringify(this.userInfo.Id);
           let pageIndex = JSON.stringify(this.pageIndex);
           let pageSize = JSON.stringify(this.pageSize)

           
            this.$axios.post('/api/Home/GetUserParticipationProject',{
                UserID: UserID,
                pageIndex: pageIndex,
                pageSize: pageSize,
            }).then(res=>{
                let resData = res.data;
                if(resData.sucess){
                    this.points = resData.data.list;
                   
                    console.log(this.points);
                    
                }else{
                    this.$Message.error(resData.data.message)
                }
            })
        }
    },
    mounted(){
        
        this.getProject();
        var map = new BMap.Map("container");    
        var point = new BMap.Point(116.404, 39.915);    
        map.centerAndZoom(point, 5);    
       

            // 创建标注    
     
        map.enableScrollWheelZoom(true);

        function addMarker(point){  // 创建图标对象   
             var marker = new BMap.Marker(point);
	         map.addOverlay(marker);   

　　　　　
            };  
    
       	for (var i = 0; i < this.points.length; i ++) {
               var x = this.points[i].x;
               var y = this.points[i].y;
		var point = new BMap.Point(x,y );
		addMarker(point);
	}
    }
    
}
</script>
<style>
  html{height:100%}    
    body{height:100%;margin:0px;padding:0px}    
    #container{width:100%;height:100vh}
    
</style>