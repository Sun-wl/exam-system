/**
 * Created by 大大大太阳 on 2016/9/28.
 * 试卷模块
 */
angular.module("app.paper",["ng","app.subject"])
    //试卷查询控制器
    .controller("paperListController",["$scope","paperListService",function ($scope,paperListService) {
        paperListService.getAllExamPapers(function (data) {
            $scope.examPapers = data;
        })
    }])
    //试卷添加控制器
    .controller("paperAddController",["$scope","getsubjectService","$routeParams","paperModel","$location",function ($scope,getsubjectService,$routeParams,paperModel,$location) {
        getsubjectService.getAllDepartments(function (data) {
            //将全部方向绑定大欧作用于的departments
            $scope.departments = data;
        });
        //双向绑定的模板
        $scope.pmodel = paperModel.model;
        var subjectId = $routeParams.id;
        if(subjectId!=0){
            paperModel.addSubjectId(subjectId);
            paperModel.addSubject($routeParams);
        }

        $scope.savePaper = function () {
            paperModel.savePaper($scope.pmodel,function (data) {
                alert(data);
                $location.path("/paperAdd/id/0/stem/0/type/0/topic/0/level/0");
            })
        }
    }])
    //试卷删除控制器
    .controller("paperDelController",["$scope",function ($scope) {

    }])
    .factory("paperListService",function ($http) {
        return {
            getAllExamPapers:function (handler) {
                $http.get("http://172.16.0.5:7777/test/exam/manager/getAllExamPapers.action")
                    .success(function (data) {
                        handler(data);
                })
            }
        };
    })
    .factory("paperModel",function ($http,$httpParamSerializer) {
        return {
            model:{
                departmentId:1, //方向id
                title:"",       //试卷标题
                desc:"",        //试卷描述
                at:0,           //答题时间
                total:0,        //总分
                scores:[],      //每题的分值
                subjectIds:[],   //每题的id
                subjects:[]
            },
            addSubjectId:function (id) {
                this.model.subjectIds.push(id);
            },
            addSubject:function (params) {
                this.model.subjects.push(angular.copy(params));
            },
            savePaper:function (params,handler) {
                var obj = {};
                for(var key in params){
                    var val = params[key];
                    switch(key){
                        case "title":obj["paper.title"]=val;break;
                        case "desc":obj["paper.description"]=val;break;
                        case "departmentId":obj["paper.department.id"]=val;break;
                        case "at":obj["paper.answerQuestionTime"]=val;break;
                        case "total":obj["paper.totalPoints"]=val;break;
                        case "scores":obj["scores"]=val;break;
                        case "subjectIds":obj["subjectIds"]=val;break;
                    }
                }
                var obj = $httpParamSerializer(obj);
                $http.post("http://172.16.0.5:7777/test/exam/manager/saveExamPaper.action",obj,{
                    headers:{
                        "Content-Type":"application/x-www-form-urlencoded"
                    }
                }).success(function (data) {
                    handler(data);
                })
            }
        };
    });