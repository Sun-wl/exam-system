/**
 * Created by 大大大太阳 on 2016/9/22.
 * 题目管理的js模块
 */



angular.module("app.subject",["ng"])
    .controller("subjectCheckController",["$routeParams","getsubjectService","$location",function ($routeParams,getsubjectService,$location) {
        var id = $routeParams.id;
        var state = $routeParams.state;
        getsubjectService.checkSubject(id,state,function (data) {
            alert(data);
            $location.path("/AllSubject/a/0/b/0/c/0/d/0");
        });


    }])
    .controller("subjectDelController",["$routeParams","getsubjectService","$location",function ($routeParams,getsubjectService,$location) {
        var flag = confirm("确认删除吗？");
        if(flag){
            var id = $routeParams.id;
            getsubjectService.delSubject(id,function (data) {
                alert(data);
            });
            $location.path("/AllSubject/a/0/b/0/c/0/d/0");
        }else{
            $location.path("/AllSubject/a/0/b/0/c/0/d/0");
        }
    }])
    .controller("subjectController",["$scope","$location","getsubjectService","$document","$routeParams",function ($scope,$location,getsubjectService,$document,$routeParams) {
        $scope.subject = {
            typeId:1,
            levelId:1,
            departmentId:1,
            topicId:1,
            stem:"",
            answer:"",
            analysis:"",
            choiceContent:[],
            choiceCorrect:[false,false,false,false]
        };
        $scope.params = $routeParams;
        $scope.add = function () {
            $location.path("/addSubject");
        };
        getsubjectService.getAllTypes(function (data) {
            $scope.types = data;
        });
        getsubjectService.getAllLevels(function (data) {
            $scope.levels = data;
        });
        getsubjectService.getAllDepartments(function (data) {
            $scope.departments = data;
        });
        getsubjectService.getAllTopics(function (data) {
            $scope.topics = data;
        });
        getsubjectService.getAllSubjects($routeParams,function (data) {
            $scope.subjects = data;
            // console.log(data);
            data.forEach(function (subject,index) {
                if(subject.subjectType){
                    //修改题号
                    subject.id = index+1;
                    //添加选项 ABCD
                    subject.choices.forEach(function (choice,index) {
                        choice.no = getsubjectService.indexToNo(index);
                    });
                    //单选或多选时的答案
                    var answer=[];
                    if(subject.subjectType.id!=3){
                        subject.choices.forEach(function (choice) {
                            if(choice.correct){
                                answer.push(choice.no);
                            }
                            subject.answer = answer.toString();

                        });
                    }
                }


            });
        });
        $scope.save = function () {
            getsubjectService.saveSubject($scope.subject,function (data) {

            });
            //重置作用域中绑定的表单默认值
            var subject = {
                typeId:1,
                levelId:1,
                departmentId:1,
                topicId:1,
                stem:"",
                answer:"",
                analysis:"",
                choiceContent:[],
                choiceCorrect:[false,false,false,false]
            };
            angular.copy(subject,$scope.subject);
        };

        $scope.saveAndClose = function () {
            getsubjectService.saveSubject($scope.subject,function (data) {

            });
            $location.path("/AllSubject/a/0/b/0/c/0/d/0");
        };


        // $scope.data = {
        //     id:"0"
        // };
        // $scope.show = function (id) {
        //     $scope.data.id = id;
        //     console.log($scope.data.id);
        // };

        // $scope.arr = {
        //     id:"0"
        // };
        // $scope.a = function (id) {
        //     $scope.arr.id = id;
        //     console.log($scope.arr.id);
        // };

        // $document.find("div.chose").on("click",function (event) {
        //     if(event.target.nodeName=="A"){
        //         angular.element(event.target)
        //             .addClass("active3")
        //             .siblings()
        //             .removeClass();
        //         }
        //     });


    }])
    // .directive("getActive3",function () {
    //     return {
    //         restrict:"A",
    //         compile:function(telement,tattrs){
    //             return function (scopt,element,attrs) {
    //                 element.find("div.chose").on("click",function (event) {
    //                     if(event.target.nodeName=="A"){
    //                         angular.element(event.target)
    //                             .addClass("active3")
    //                             .siblings()
    //                             .removeClass();
    //                     }
    //                 });
    //             }
    //         }
    //     }
    // })
    .config(["getsubjectServiceProvider",function (getsubjectServiceProvider) {
        getsubjectServiceProvider.setUrl("http://172.16.0.5:7777/test/exam/manager");
    }])
    .provider("getsubjectService",function () {
        //获取题型，难度，方向，知识点
        this.url = "";
        this.setUrl = function (url) {
            this.url = url;
        };
        this.$get = function ($http,$routeParams,$httpParamSerializer) {
            var self = this;
            return {
                indexToNo:function(index){
                    //将index(0 1 2 3 4)改为选项形式no(A B C D)
                    //return index==0?"A":(index==1?"B":(index==2?"C":(index==3?"D":(index==4?"E":""))));
                     switch(index){
                         case 0:return "A";break;
                         case 1:return "B";break;
                         case 2:return "C";break;
                         case 3:return "D";break;
                         default:return "E";
                     }

                },
                getAllTypes:function (handler) {
                    $http.get("data/types.json").success(function (data) {
                    //$http.get(self.url+"/getAllSubjectType.action").success(function (data) {
                        handler(data);
                    });
                },
                getAllLevels:function (handler) {
                    $http.get("data/levels.json").success(function (data) {
                    //$http.get(self.url+"/getAllSubjectLevel.action").success(function (data) {
                        handler(data);
                    });
                },
                getAllDepartments:function (handler) {
                    $http.get("data/departments.json").success(function (data) {
                    //$http.get(self.url+"/getAllDepartmentes.action").success(function (data) {
                        handler(data);
                    });
                },
                getAllTopics:function (handler) {
                    $http.get("data/topics.json").success(function (data) {
                    //$http.get(self.url+"/getAllTopics.action").success(function (data) {
                        handler(data);
                    });
                },
                getAllSubjects:function (params,handler) {
                    // console.log(params);
                    var arr = {};
                    for(var key in params){
                        var val = params[key];
                        if(val!=0){
                            switch(key){
                                case "a":arr['subject.subjectType.id']=val;break;
                                case "b":arr['subject.subjectLevel.id']=val;break;
                                case "c":arr['subject.department.id']=val;break;
                                case "d":arr['subject.topic.id']=val;break;
                            }
                        }

                    }
                    // console.log(arr);
                    $http.get("data/getAllSubjects.json",{
                    //$http.get(self.url+"/getAllSubjects.action",{
                        params:arr
                    }).success(function (data) {
                        handler(data);
                    });
                },
                saveSubject:function (params,handler) {
                    console.log(params);
                    var obj = {};
                    for(var key in params){
                        var val = params[key];
                        switch(key){
                            case "typeId":obj["subject.subjectType.id"]=val;break;
                            case "levelId":obj["subject.subjectLevel.id"]=val;break;
                            case "departmentId":obj["subject.department.id"]=val;break;
                            case "topicId":obj["subject.topic.id"]=val;break;
                            case "stem":obj["subject.stem"]=val;break;
                            case "answer":obj["subject.answer"]=val;break;
                            case "analysis":obj["subject.analysis"]=val;break;
                            case "choiceContent":obj["choiceContent"]=val;break;
                            case "choiceCorrect":obj["choiceCorrect"]=val;break;


                        }
                    }
                    console.log(obj);
                    //对obj对象进行表单格式的序列化（默认使用JSON格式）
                    obj = $httpParamSerializer(obj);
                    $http.post(self.url+"/saveSubject.action",obj,{
                        headers:{
                            "Content-Type":"application/x-www-form-urlencoded"
                        }
                    }).success(function (data) {
                        handler(data);
                    });
                },

                delSubject:function (id,handler) {
                    $http.get(self.url+"/delSubject.action",{
                           params:{'subject.id':id}
                    }).success(function (data) {
                        handler(data);
                    });
                },
                checkSubject:function (id,state,handler) {
                    $http.get(self.url+"/checkSubject.action",{
                        params:{
                            'subject.id':id,
                            'subject.checkState':state
                        }
                    }).success(function (data) {
                        handler(data);
                    });
                }
            };
        }
    })
    .filter("selectTopics",function () {
        //input要过滤的内容，id方向id
        return function (input,id) {
            if(input){
                //循环遍历将
                var result = input.filter(function (item) {
                    return item.department.id == id;
                });
                //将过滤后的结果返回
                return result;
            }

        };
    })
    .directive("selectOption",function () {
        return {
            restrict:"A",
            link:function (scope,element) {
               element.on("change",function () {
                   var type = $(this).attr("type");
                   var val = $(this).val();

                   if(type=="radio"){
                       //重置
                       scope.subject.choiceCorrect = [false,false,false,false];
                       for(var i=0;i<4;i++){
                           if(i==val){
                               scope.subject.choiceCorrect[i]=true;
                           }
                       }
                   }else if(type == "checkbox"){
                       for(var i=0;i<4;i++){
                           if(i==val){
                               scope.subject.choiceCorrect[i]=true;
                           }
                       }
                   }

                   //强制消化
                   scope.$digest();
               });
            }
        };
    });
