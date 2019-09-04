import React,{Component} from 'react';
import './App.css';
import TaskForm from './components/TaskForm';
import Control from './components/Control';
import TaskList from './components/TaskList';
class App extends Component{
    constructor(props){
        super(props);
        this.state={
            tasks:[],//id:unique
            isDisplayForm:false,
            taskEditing:'',
            filter:{
                name:"",
                status:-1
            }
        };
    }
    UNSAFE_componentWillMount(){
        if(localStorage && localStorage.getItem('tasks')){
            var tasks=JSON.parse(localStorage.getItem('tasks'));
            this.setState({
                tasks:tasks
            });
        }
    }

    s4(){
        return Math.floor((1+Math.random())*0x10000).toString(16).substring(1);
    }
    generateID(){
        return this.s4()+this.s4()+'-'+this.s4()+this.s4()+'-'+this.s4()+this.s4()+'-'+this.s4()+this.s4()+'-'+this.s4()+this.s4()+this.s4()+this.s4()+'-'+this.s4()+this.s4()+this.s4()+this.s4()+'-'+this.s4()+this.s4();
    }
    onToggleForm=()=>{
        if(this.state.isDisplayForm && this.state.taskEditing!==null){
            this.setState({
                isDisplayForm:true,
                taskEditing:null
            })
        }else{
            this.setState({
                isDisplayForm:!this.state.isDisplayForm,
                taskEditing:null
            })
        }
    }
    onCloseForm=(value)=>{
        this.setState({
            isDisplayForm:false
        });
    }
    onShowForm=()=>{
        this.setState({
            isDisplayForm:true
        });
    }
    onSubmit=(data)=>{
        var { tasks }=this.state;
        if(data.id===''){
            data.id=this.generateID();
            tasks.push(data);
        }else{
            var index=this.findIndex(data.id);
            tasks[index]=data;
        }
        this.setState({
            tasks:tasks,
            taskEditing:null
        });
        localStorage.setItem('tasks',JSON.stringify(tasks));
    }
    onUpdateStatus=(id)=>{
        var  { tasks }=this.state;
        var index=this.findIndex(id);
        if(index!==-1){
            tasks[index].status=!tasks[index].status;
        };
        this.setState({
            tasks:tasks
        });
        localStorage.setItem('tasks',JSON.stringify(tasks));

    }
    findIndex=(id)=>{
        var  { tasks }=this.state;
        var result=-1;
        tasks.forEach((task,index)=>{
            if (task.id===id) {
                result= index;
            }
        });
        return result;
    }
    onDelete=(id)=>{
        var  { tasks }=this.state;
        var index=this.findIndex(id);
        if(index!==1){
           tasks.splice(index,1); 
            this.setState({
                tasks:tasks
            });
        };
        localStorage.setItem('tasks',JSON.stringify(tasks));
    }
    onUpdate=(id)=>{
        var { tasks }=this.state;
        var index = this.findIndex(id);
        var taskEditing=tasks[index];
        this.setState({
            taskEditing:taskEditing
        });
        this.onShowForm();
    }
    onFilter=(filterName,filterStatus)=>{
        filterStatus=parseInt(filterStatus);
        this.setState({
            filter:{
                name:filterName.toLowerCase(),
                status:filterStatus
            }
        });
    }
  render(){
    var { tasks,isDisplayForm,taskEditing,filter }=this.state;
    if(filter){
        if(filter.name){
            tasks=tasks.filter((task,index)=>{
                return task.name.toLowerCase().indexOf(filter.name)!==-1; 
            });
        }
        if(filter.status){
            tasks=tasks.filter((task,index)=>{
                if(filter.status===-1){
                    return task;
                }else{
                    return task.status===filter.status;
                }
            });
        }
    }
    var elmTaskForm=isDisplayForm?<TaskForm taskEditing={ taskEditing }  onCloseForm={this.onCloseForm} onSubmit={this.onSubmit}/>:'';
    return (
      <div className="container">
        <div className="text-center">
            <h1>Quản Lý Công Việc</h1>
            <hr/>
        </div>
        <div className="row">
            <div className={isDisplayForm?"col-xs-4 col-sm-4 col-md-4 col-lg-4":""}>
                { elmTaskForm }
            </div>
            <div className={isDisplayForm?"col-xs-8 col-sm-8 col-md-8 col-lg-8":"col-xs-12 col-sm-12 col-md-12 col-lg-12"}>
                <button type="button" onClick={this.onToggleForm} className="btn btn-primary">
                    <span className="fa fa-plus mr-5"></span>Thêm Công Việc
                </button>
                <Control/>
                <TaskList onFilter={this.onFilter} tasks={tasks} onUpdate={ this.onUpdate } onDelete={this.onDelete} onUpdateStatus={ this.onUpdateStatus }/>
            </div>
        </div>
    </div>
    );
  }
}

export default App;
