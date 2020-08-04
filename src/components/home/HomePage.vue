<template>
  <div class="hello">

    <div id="mapContainer" style="position: absolute;"></div>

    <div id="all" style="height:100%;background-color: #dd6161;">
      <div class="posInput">
        <el-input style="width:100%"
                  id="startAddress"
                  type="text"
                  placeholder="请输入出发点"
                  prefix-icon="el-icon-search"
                  v-model="startAddress"
                  clearable
                  @focus="addressAutoComplete($event)">
        </el-input>
        <el-button type="primary" size="large" style="margin-left:12px;padding: 10px 20px">确定
        </el-button>
      </div>
      <div class="posSubmit">
        <el-input style="width:100%"
                  id="endAddress"
                  type="text"
                  placeholder="请输入目的地"
                  prefix-icon="el-icon-search"
                  clearable
                  v-model="endAddress"
                  @focus="addressAutoComplete($event)">
        </el-input>

      </div>
    </div>



  </div>
</template>

<script>
    export default {
        name: 'HomePage',
        data() {
            return {
                msg: 'Welcome to Your Vue.js App',
                mapObj: null,
                marker: '',
                thisPosition: {
                    location: '',
                    lng: '',
                    lat: ''
                },
                mapinitCode: 0,//地理编码:1;地理逆编码:2
                startAddress: '',
                startLng:'',
                startLat:'',
                endAddress: '',
                endLng:'',
                endLat:'',


            }
        },
        mounted() {
            this.loadMap()
        },
        methods: {
            loadMap() {
                const self = this
                this.mapObj = new AMap.Map('mapContainer', {
                    resizeEnable: true, //是否监控地图容器尺寸变化
                    zoom: 14, //初始化地图层级
                    rotateEnable: true,
                    pitchEnable: true,
                    pitch: 40,// 上下旋转
                    rotation: 0,//左右旋转
                    viewMode: '3D',//开启3D视图,默认为关闭
                    expandZoomRange: true,
                    zooms: [3, 20],

                });

                // 注入插件（定位插件，地理编码插件）

                this.mapObj.setMapStyle('amap://styles/macaron');


            },

            addressAutoComplete(event){

                console.log("@@onfocus")
                // console.log(event.currentTarget)
                var id = event.currentTarget.id

                var _this = this
                AMap.plugin(['AMap.Autocomplete', 'AMap.PlaceSearch'], function () {
                    var autoOptions = {
                        city: "嘉兴", //城市，默认全国
                        input: id//使用联想输入的input的id
                    };
                    var autocomplete = new AMap.Autocomplete(autoOptions);
                    var placeSearch = new AMap.PlaceSearch({
                        city: '嘉兴',
                        map: _this.mapObj,
                        autoFitView: true, // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围

                    })
                    AMap.event.addListener(autocomplete, "select", function (e) {
                        //TODO 针对选中的poi实现自己的功能

                        console.log("##select")
                        console.log(e.poi)
                        placeSearch = new AMap.PlaceSearch({
                            map:_this.mapObj
                        })
                        placeSearch.search(e.poi.name)
                        // placeSearch.setCity(e.poi.adcode);
                        // placeSearch.search(e.poi.name)
                        // console.log('经度', e.poi.location.lng)
                        // console.log('纬度', e.poi.location.lat)

                        //点击事件
                        AMap.event.addListener(placeSearch, "markerClick", function(e) {
                            console.log("$$markerClick")
                            console.log(e);//当前marker的经纬度信息

                            document.getElementById(id).value = e.data.address;

                            console.log('经度', e.data.location.lng)
                            console.log('纬度', e.data.location.lat)
                            if(id === "startAddress"){
                                _this.startLng = e.data.location.lng
                                _this.startLat = e.data.location.lat
                            }else if (id === "endAddress"){
                                _this.endLng = e.data.location.lng
                                _this.endLat = e.data.location.lat
                            }
                            console.log('经度1',_this.startLng)
                            console.log('经度2', _this.endLng)

                            /* 做地图拖拽选址 */
                            // AMapUI.loadUI(['misc/PositionPicker'], function(PositionPicker) {
                            //     console.log('##')
                            //     var positionPicker = new PositionPicker({
                            //         mode: 'dragMap',
                            //         map: _this.mapObj
                            //     });
                            //     positionPicker.on('success', function(positionResult) {
                            //         let position = positionResult.position;
                            //         // console.log(positionResult.position.lng);
                            //         // console.log(positionResult.position.lat);
                            //         if(id === "startAddress"){
                            //             _this.startLng = positionResult.position.lng
                            //             _this.startLat = positionResult.position.lat
                            //         }else if (id === "endAddress"){
                            //             _this.endLng = positionResult.position.lng
                            //             _this.endLat = positionResult.position.lat
                            //         }
                            //         console.log('经度111',_this.startLng)
                            //         console.log('经度222', _this.endLng)
                            //         document.getElementById(id).value = positionResult.address;
                            //
                            //     });
                            //     positionPicker.on('fail', function(positionResult) {
                            //         console.log('fail');
                            //     });
                            //     var onModeChange = function(e) {
                            //         positionPicker.setMode(e.target.value)
                            //     }
                            //     positionPicker.start();
                            // });
                        })
                    });
                    _this.mapObj.clearMap() // 清除地图覆盖物

                });



            },

            // 根据坐标返回地址(逆地理编码)
            getAddress(points) {
                let geocoder = new AMap.Geocoder({radius: 1000})
                geocoder.getAddress(points, (status, result) => {
                    if (status === 'complete' && result.regeocode) {
                        this.address = result.regeocode.formattedAddress
                    }
                })
            },
        }

    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }

  #mapContainer {
    width: 100vw;
    height: 90vh;
  }

  .posInput {
    position: absolute;
    z-index: 1;
    width: 26%;
    margin-top: 20px;
    margin-left: 5%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .posSubmit {
    position: absolute;
    z-index: 1;
    width: 20%;
    margin-top: 65px;
    margin-left: 5%;

  }

</style>
