var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
window.onload = function () {
    var canvas = document.getElementById("context");
    var stage = engine.run(canvas);
    //生成任务条件 
    function creatTaskCondition(type, target) {
        var taskCondition = null;
        if (type == "NPCTalkTaskCondition")
            taskCondition = new NPCTalkTaskCondition();
        if (type == "KillMonsterTaskCondition")
            taskCondition = new KillMonsterTaskCondition(target);
        return taskCondition;
    }
    //生成任务
    function creatTask(id) {
        var taskCondition = null;
        taskCondition = creatTaskCondition(Task.Task_LIST[id].TaskCondition.type, Task.Task_LIST[id].TaskCondition.target);
        var task = new Task(id, Task.Task_LIST[id].name, Task.Task_LIST[id].dris, Task.Task_LIST[id].fromNPCid, Task.Task_LIST[id].toNPCid, Task.Task_LIST[id].TaskCondition.total, taskCondition, Task.Task_LIST[id].toid);
        return task;
    }
    /**
     * 创建游戏场景
     * Create a game scene
     */
    var user;
    var map = new TileMap();
    var _container = new engine.DisplayObjectContainer();
    //this.gameManager = GameManager.getInstance();
    _container.addChild(map);
    map.Create();
    var gameScene = new GameScene(map);
    GameManager.getInstance().secneManager.addScene(gameScene);
    user = User.getInstance();
    //this._container.addChild(this.user.container)
    GameManager.getInstance().UIManager.addLayer(LayerType.UILayer, user.container);
    user.setinformation("982049377", User.idlelist, User.walklist);
    // console.log(User.idlelist.length)
    //this.addChild(this._container);
    walkByTap();
    //this.mapMove();
    var guanyu = new Hero();
    var bitmap = new engine.Bitmap();
    bitmap.src = "/Game/assets/001.png";
    guanyu.setinformation("001", "关羽", 95, 85, heroQualitySort.S, bitmap);
    user.addHero(guanyu);
    user.inToTeam(guanyu);
    var qinglongyanyuedao = new Equipment();
    bitmap.src = "/Game/assets/weapan001.png";
    qinglongyanyuedao.setinformation("we001", 10, 0, "青龙偃月刀", equipmentQualitySort.Story, bitmap);
    // var atkCrystal = new Crystal();
    // bitmap = this.createBitmapByName("atk001_png");
    // atkCrystal.setinformation("atk001", 5, 0, "攻击宝石", bitmap)
    // var defCrystal = new Crystal();
    // bitmap = this.createBitmapByName("def001_png");
    // defCrystal.setinformation("def001", 0, 5, "防御宝石", bitmap)
    guanyu.addEquipment(user, qinglongyanyuedao);
    //qinglongyanyuedao.addCrystal(this.user, atkCrystal);
    //qinglongyanyuedao.addCrystal(this.user, defCrystal);
    var taskService = TaskService.getIntance();
    var task = creatTask("001");
    var task2 = creatTask("002");
    taskService.addTask(task);
    taskService.addTask(task2);
    var NPC1 = new NPC("01");
    var NPC2 = new NPC("02");
    taskService.addObserver(NPC1);
    taskService.addObserver(NPC2);
    taskService.Canaccept("001");
    NPC1.call();
    NPC2.call();
    // taskService.accept(task.getid());
    // this._container.addChild(NPC1);
    // this._container.addChild(NPC2);
    GameManager.getInstance().UIManager.addLayer(LayerType.UILayer, NPC1);
    GameManager.getInstance().UIManager.addLayer(LayerType.UILayer, NPC2);
    NPC1.x = 500;
    NPC1.y = 400;
    NPC2.x = 900;
    NPC2.y = 900;
    var TaskPanelLogo = new engine.Bitmap();
    TaskPanelLogo.src = "/Game/assets/TaskPanelLogo.png";
    TaskPanelLogo.x = 350;
    TaskPanelLogo.y = 1000;
    TaskPanelLogo.scaleX = 0.5;
    TaskPanelLogo.scaleY = 0.5;
    //this._container.addChild(TaskPanelLogo);
    //GameManager.getInstance().UIManager.addLayer(LayerType.UILayer, TaskPanelLogo);
    //GameManager.getInstance().secneManager.currentScene.addChild(TaskPanelLogo);
    TaskPanelLogo.touchEnable = true;
    var taskPanel = new TaskPanel();
    TaskPanelLogo.addEventListener(engine.MyTouchEvent.TouchClick, function () {
        //var taskPanel=new TaskPanel();
        taskPanel.call();
        //this._container.addChild(taskPanel);
        GameManager.getInstance().UIManager.addLayer(LayerType.DetailLayer, taskPanel);
        // taskPanel.x = 100;
        // taskPanel.y = 600;
    });
    var monster = new Monster();
    var bit = new engine.Bitmap();
    bit.src = "/Game/assets/Monster.png";
    monster.call("monster001", "黄巾贼", 60, 50, bit, 50);
    monster.x = 400;
    monster.y = 900;
    monster.scaleX = 0.5;
    monster.scaleY = 0.5;
    //this._container.addChild(monster);
    GameManager.getInstance().UIManager.addLayer(LayerType.UILayer, monster);
    _container.addChild(GameManager.getInstance().UIManager);
    stage.addChild(_container);
    stage.addChild(TaskPanelLogo); //为了能移动
    function walkByTap() {
        function ss() { }
        map.touchEnable = true;
        map.addEventListener(engine.MyTouchEvent.TouchClick, function (evt) {
            var walkCommand = new WalkCommand(evt.stageX, evt.stageY);
            walkCommand.execute(ss);
            //console.log("x"+evt.stageX+"y"+evt.stageY);
        });
    }
};
var Astar = (function () {
    function Astar(grid) {
        this._path = [];
        this._openArray = [];
        this._closeArray = [];
        this._straightCost = 1.0;
        this._diagCost = 1.4;
        this._grid = grid;
    }
    Astar.prototype.setEndNode = function (xpos, ypos) {
        this._endx = xpos;
        this._endy = ypos;
    };
    Astar.prototype.setStartNode = function (xpos, ypos) {
        this._startx = xpos;
        this._starty = ypos;
        // console.log("起点x:"+xpos+"y:"+ypos)
    };
    Astar.prototype.manhattan = function (node) {
        return Math.abs(node.x - this._endx) * this._straightCost + Math.abs(node.y + this._endy) * this._straightCost;
    };
    //几何估价法
    Astar.prototype.euclidian = function (node) {
        var dx = node.x - this._endx;
        var dy = node.y - this._endy;
        return Math.sqrt(dx * dx + dy * dy) * this._straightCost;
    };
    //对角线估价法
    Astar.prototype.diagonal = function (node) {
        var dx = Math.abs(node.x - this._endx);
        var dy = Math.abs(node.y - this._endy);
        var diag = Math.min(dx, dy);
        var straight = dx + dy;
        return this._diagCost * diag + this._straightCost * (straight - 2 * diag);
    };
    /* public find(){
         var mm=new MapNode(this._startx,this._starty);
         // this._grid.OuttoConsole();
         // console.log(mm.x+"0.123"+mm.y);
         console.log("起点x:"+this._startx+"y:"+this._starty)
         console.log("终点x:"+this._endx+"y:"+this._endy)
         this.findPath(mm);
     }*/
    Astar.prototype.findPath = function () {
        var m = new MapNode(this._startx, this._starty); // 起始点加入open表  
        m.g = 0;
        m.h = this.manhattan(m);
        m.parent = null;
        this._openArray.push(m);
        //    console.log(m.x+"0.123"+m.y);       
        if (m.x == this._endx && m.y == this._endy) {
            console.log("起点==终点！\n");
            //return 0; 
        }
        var is_found = false;
        while (true) {
            if (this._openArray.length > 0)
                this.adjust_heap(); // 调整开放列表  
            var curr_node = this._openArray[0]; // open表的第一个点一定是f值最小的点(通过堆排序得到的)  
            this._openArray.shift();
            this._closeArray[this._closeArray.length++] = curr_node; // 当前点加入close表  
            //console.log("寻路x:"+curr_node.x+"          y:"+curr_node.y);    
            if (curr_node.x == this._endx && curr_node.y == this._endy) {
                is_found = true;
                break;
            }
            this.get_neighbors(curr_node); // 对邻居的处理  
            if (this._openArray.length == 0) {
                is_found = false;
                break;
            }
            if (this._openArray.length > 0)
                this.adjust_heap();
        }
        var top = -1;
        if (is_found) {
            curr_node.x = this._endx;
            curr_node.y = this._endy;
            while (curr_node) {
                this._path[++top] = curr_node;
                curr_node = curr_node.parent;
            }
            // while( top >= 0 )        // 下面是输出路径看看~  
            // {  
            //     if ( top > 0 )  
            //     {  
            //         console.log("(%d,%d)-->", this._path[top].x, this._path[top--].y);  
            //     }  
            //     else  
            //     {  
            //         console.log("(%d,%d)",this._path[top].x, this._path[top--].y);  
            //     }  
            // }  
            return 1;
        }
        else {
            console.log("没有找到路径");
            return -1;
        }
    };
    Astar.prototype.empty = function () {
        var n = this._closeArray.length;
        for (var i = 0; i < n; i++)
            this._closeArray.shift();
        var n = this._openArray.length;
        for (var i = 0; i < n; i++)
            this._openArray.shift();
        var n = this._path.length;
        for (var i = 0; i < n; i++)
            this._path.shift();
    };
    Astar.prototype.Has_closeArray = function (M) {
        for (var i = 0; i <= this._closeArray.length; i++) {
            if (this._closeArray[i] == M)
                return true;
        }
        return false;
    };
    Astar.prototype.Has_openArray = function (M) {
        for (var i = 0; i <= this._openArray.length; i++) {
            if (this._openArray[i] == M)
                return true;
        }
        return false;
    };
    Astar.prototype.swap = function (idx1, idx2) {
        var tmp = this._openArray[idx1];
        this._openArray[idx1] = this._openArray[idx2];
        this._openArray[idx2] = tmp;
    };
    // 堆调整  
    //   
    Astar.prototype.adjust_heap = function () {
        var n = 0;
        for (var i = 0; i < this._openArray.length; i++) {
            if ((this._openArray[n].g + this._openArray[n].h) > (this._openArray[i].g + this._openArray[i].h)) {
                n = i;
            }
        }
        this.swap(n, 0);
    };
    // 判断邻居点是否可以进入open表  
    //   
    Astar.prototype.insert_to_opentable = function (x, y, curr_node, w) {
        var i;
        if (this._grid._Grid[x][y].WalkAble != false) {
            if (!this.Has_closeArray(this._grid._Grid[x][y])) {
                // if (this.Has_openArray(this._grid._Grid[x][y])) // 在open表中  
                // {
                //     // 需要判断是否是一条更优化的路径  
                //     //   
                //     if (this._grid._Grid[x][y].g > curr_node.g + w)    // 如果更优化  
                //     {
                //         this._grid._Grid[x][y].g = curr_node.g + w;
                //         this._grid._Grid[x][y].parent = curr_node;
                //         for (i = 0; i < this._openArray.length; ++i) {
                //             if (this._openArray[i].x == this._grid._Grid[x][y].x && this._openArray[i].y == this._grid._Grid[x][y].y) {
                //                 break;
                //             }
                //         }
                //         if (this._openArray.length > 0)
                //             this.adjust_heap();                   // 下面调整点  
                //     }
                // }
                // else       
                if (!this.Has_openArray(this._grid._Grid[x][y])) {
                    this._grid._Grid[x][y].g = curr_node.g + w;
                    this._grid._Grid[x][y].h = this.manhattan(this._grid._Grid[x][y]);
                    this._grid._Grid[x][y].parent = curr_node;
                    this._openArray.push(this._grid._Grid[x][y]);
                }
            }
        }
    };
    // 查找邻居  
    // 对上下左右8个邻居进行查找  
    //    
    Astar.prototype.get_neighbors = function (curr_node) {
        var x = curr_node.x;
        var y = curr_node.y;
        // 下面对于8个邻居进行处理！  
        //   
        if ((x + 1) >= 0 && (x + 1) < 10 && y >= 0 && y < 10) {
            this.insert_to_opentable(x + 1, y, curr_node, 10);
        }
        if ((x - 1) >= 0 && (x - 1) < 10 && y >= 0 && y < 10) {
            this.insert_to_opentable(x - 1, y, curr_node, 10);
        }
        if (x >= 0 && x < 10 && (y + 1) >= 0 && (y + 1) < 10) {
            this.insert_to_opentable(x, y + 1, curr_node, 10);
        }
        if (x >= 0 && x < 10 && (y - 1) >= 0 && (y - 1) < 10) {
            this.insert_to_opentable(x, y - 1, curr_node, 10);
        }
        if ((x + 1) >= 0 && (x + 1) < 10 && (y + 1) >= 0 && (y + 1) < 10) {
            this.insert_to_opentable(x + 1, y + 1, curr_node, 14);
        }
        if ((x + 1) >= 0 && (x + 1) < 10 && (y - 1) >= 0 && (y - 1) < 10) {
            this.insert_to_opentable(x + 1, y - 1, curr_node, 14);
        }
        if ((x - 1) >= 0 && (x - 1) < 10 && (y + 1) >= 0 && (y + 1) < 10) {
            this.insert_to_opentable(x - 1, y + 1, curr_node, 14);
        }
        if ((x - 1) >= 0 && (x - 1) < 10 && (y - 1) >= 0 && (y - 1) < 10) {
            this.insert_to_opentable(x - 1, y - 1, curr_node, 14);
        }
    };
    return Astar;
}());
var MapNode = (function () {
    function MapNode(x, y) {
        this.x = x;
        this.y = y;
    }
    MapNode.prototype.compare = function (n) {
        if (this.x == n.x && this.x == n.y) {
            return true;
        }
        return false;
    };
    return MapNode;
}());
var Grid = (function () {
    function Grid(x, y) {
        this._Grid = new Array();
        for (var i = 0; i < x; i++) {
            var TempArray = new Array();
            for (var j = 0; j < y; j++)
                TempArray.push(new MapNode(-1, -1));
            this._Grid.push(TempArray);
        }
    }
    Grid.prototype.setWalkAble = function (x, y, WalkAble) {
        this._Grid[x][y].f = 0;
        this._Grid[x][y].g = 0;
        this._Grid[x][y].h = 0;
        this._Grid[x][y].parent = null;
        this._Grid[x][y].x = x;
        this._Grid[x][y].y = y;
        this._Grid[x][y].WalkAble = WalkAble;
    };
    Grid.prototype.OuttoConsole = function () {
        for (var i = 0; i < this._Grid.length; i++)
            for (var j = 0; j < this._Grid[i].length; j++)
                console.log("x:" + this._Grid[i][j].x + "y:" + this._Grid[i][j].y + "WalkAble:" + this._Grid[i][j].WalkAble);
    };
    return Grid;
}());
var TileMap = (function (_super) {
    __extends(TileMap, _super);
    function TileMap() {
        var _this = _super.call(this) || this;
        _this.MapSize = 100;
        _this.MapInfomation = [
            { x: 0, y: 0, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 0, y: 1, WalkAble: false, image: "/Game/assets/water.jpg" },
            { x: 0, y: 2, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 0, y: 3, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 0, y: 4, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 0, y: 5, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 0, y: 6, WalkAble: false, image: "/Game/assets/water.jpg" },
            { x: 0, y: 7, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 0, y: 8, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 0, y: 9, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 1, y: 0, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 1, y: 1, WalkAble: false, image: "/Game/assets/water.jpg" },
            { x: 1, y: 2, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 1, y: 3, WalkAble: false, image: "/Game/assets/water.jpg" },
            { x: 1, y: 4, WalkAble: false, image: "/Game/assets/water.jpg" },
            { x: 1, y: 5, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 1, y: 6, WalkAble: false, image: "/Game/assets/water.jpg" },
            { x: 1, y: 7, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 1, y: 8, WalkAble: false, image: "/Game/assets/water.jpg" },
            { x: 1, y: 9, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 2, y: 0, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 2, y: 1, WalkAble: false, image: "/Game/assets/water.jpg" },
            { x: 2, y: 2, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 2, y: 3, WalkAble: false, image: "/Game/assets/water.jpg" },
            { x: 2, y: 4, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 2, y: 5, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 2, y: 6, WalkAble: false, image: "/Game/assets/water.jpg" },
            { x: 2, y: 7, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 2, y: 8, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 2, y: 9, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 3, y: 0, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 3, y: 1, WalkAble: false, image: "/Game/assets/water.jpg" },
            { x: 3, y: 2, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 3, y: 3, WalkAble: false, image: "/Game/assets/water.jpg" },
            { x: 3, y: 4, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 3, y: 5, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 3, y: 6, WalkAble: false, image: "/Game/assets/water.jpg" },
            { x: 3, y: 7, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 3, y: 8, WalkAble: false, image: "/Game/assets/water.jpg" },
            { x: 3, y: 9, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 4, y: 0, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 4, y: 1, WalkAble: false, image: "/Game/assets/water.jpg" },
            { x: 4, y: 2, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 4, y: 3, WalkAble: false, image: "/Game/assets/water.jpg" },
            { x: 4, y: 4, WalkAble: false, image: "/Game/assets/water.jpg" },
            { x: 4, y: 5, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 4, y: 6, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 4, y: 7, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 4, y: 8, WalkAble: false, image: "/Game/assets/water.jpg" },
            { x: 4, y: 9, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 5, y: 0, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 5, y: 1, WalkAble: false, image: "/Game/assets/water.jpg" },
            { x: 5, y: 2, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 5, y: 3, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 5, y: 4, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 5, y: 5, WalkAble: false, image: "/Game/assets/water.jpg" },
            { x: 5, y: 6, WalkAble: false, image: "/Game/assets/water.jpg" },
            { x: 5, y: 7, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 5, y: 8, WalkAble: false, image: "/Game/assets/water.jpg" },
            { x: 5, y: 9, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 6, y: 0, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 6, y: 1, WalkAble: false, image: "/Game/assets/water.jpg" },
            { x: 6, y: 2, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 6, y: 3, WalkAble: false, image: "/Game/assets/water.jpg" },
            { x: 6, y: 4, WalkAble: false, image: "/Game/assets/water.jpg" },
            { x: 6, y: 5, WalkAble: false, image: "/Game/assets/water.jpg" },
            { x: 6, y: 6, WalkAble: false, image: "/Game/assets/water.jpg" },
            { x: 6, y: 7, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 6, y: 8, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 6, y: 9, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 7, y: 0, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 7, y: 1, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 7, y: 2, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 7, y: 3, WalkAble: false, image: "/Game/assets/water.jpg" },
            { x: 7, y: 4, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 7, y: 5, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 7, y: 6, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 7, y: 7, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 7, y: 7, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 7, y: 8, WalkAble: false, image: "/Game/assets/water.jpg" },
            { x: 7, y: 9, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 8, y: 0, WalkAble: false, image: "/Game/assets/water.jpg" },
            { x: 8, y: 1, WalkAble: false, image: "/Game/assets/water.jpg" },
            { x: 8, y: 2, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 8, y: 3, WalkAble: false, image: "/Game/assets/water.jpg" },
            { x: 8, y: 4, WalkAble: false, image: "/Game/assets/water.jpg" },
            { x: 8, y: 5, WalkAble: false, image: "/Game/assets/water.jpg" },
            { x: 8, y: 6, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 8, y: 7, WalkAble: false, image: "/Game/assets/water.jpg" },
            { x: 8, y: 8, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 8, y: 9, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 9, y: 0, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 9, y: 1, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 9, y: 2, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 9, y: 3, WalkAble: false, image: "/Game/assets/water.jpg" },
            { x: 9, y: 4, WalkAble: false, image: "/Game/assets/water.jpg" },
            { x: 9, y: 5, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 9, y: 6, WalkAble: true, image: "/Game/assets/road.jpg" },
            { x: 9, y: 7, WalkAble: false, image: "/Game/assets/water.jpg" },
            { x: 9, y: 8, WalkAble: false, image: "/Game/assets/water.jpg" },
            { x: 9, y: 9, WalkAble: true, image: "/Game/assets/road.jpg" },
        ];
        return _this;
        //this._grid= new Grid(10,10);
        //this._astar=new Astar(this._grid);
        //this.Create();
    }
    TileMap.prototype.Create = function () {
        this._grid = new Grid(10, 10);
        var Container = new engine.DisplayObjectContainer();
        for (var i = 0; i < this.MapInfomation.length; i++) {
            var date = this.MapInfomation[i];
            var tile = new Tile(date, this.MapSize, this._grid);
            this.addChild(tile);
        }
        // this.parent.stage.addEventListener(egret.TouchEvent.TOUCH_TAP,(e:egret.TouchEvent)=>{
        //     var x=Math.floor(e.stageX/this.MapSize);
        //     var y=Math.floor(e.stageY/this.MapSize);
        //     console.log("鼠标点击点xx:"+x+"yy"+y)
        // },this)
        this._astar = new Astar(this._grid);
        //console.log("AstarCreate");
    };
    return TileMap;
}(engine.DisplayObjectContainer));
var Tile = (function (_super) {
    __extends(Tile, _super);
    function Tile(Date, mapsize, grid) {
        var _this = _super.call(this) || this;
        _this.date = Date;
        _this.MapSize = mapsize;
        var Bitmap = new engine.Bitmap();
        Bitmap.src = Date.image;
        Bitmap.x = Date.x * _this.MapSize;
        Bitmap.y = Date.y * _this.MapSize;
        grid.setWalkAble(Date.x, Date.y, Date.WalkAble);
        _this.addChild(Bitmap);
        return _this;
        //grid.OuttoConsole();
    }
    return Tile;
}(engine.DisplayObjectContainer));
var WalkCommand = (function () {
    function WalkCommand(x, y) {
        this.x = x;
        this.y = y;
    }
    WalkCommand.prototype.execute = function (callback) {
        GameManager.getInstance().secneManager.currentScene.moveTo(this.x, this.y, function () {
            callback();
        });
    };
    WalkCommand.prototype.cancel = function (callback) {
        GameManager.getInstance().secneManager.currentScene.stopMove(function () {
            callback();
        });
    };
    return WalkCommand;
}());
var FightCommand = (function () {
    function FightCommand() {
        /**
         * 所有的 Command 都需要有这个标记，应该如何封装处理这个问题呢？
         */
        this._hasBeenCancelled = false;
        this.sceneService = GameManager.getInstance().secneManager.currentScene;
    }
    //i = 0;
    FightCommand.prototype.execute = function (callback) {
        var _this = this;
        //this.i++;
        //this.sceneService.notify("002");
        //console.log(this.i);
        // console.log("开始战斗")
        engine.setTimeout(function () {
            if (!_this._hasBeenCancelled) {
                // console.log("结束战斗")
                callback();
            }
        }, 500);
    };
    FightCommand.prototype.cancel = function (callback) {
        console.log("脱离战斗");
        this._hasBeenCancelled = true;
        engine.setTimeout(function () {
            callback();
        }, 100);
    };
    return FightCommand;
}());
var TalkCommand = (function () {
    function TalkCommand(AimNPC) {
        this.AimNPC = AimNPC;
    }
    TalkCommand.prototype.execute = function (callback) {
        this.AimNPC.OpenDialogue();
        //console.log("打开对话框")
        engine.setTimeout(function () {
            //console.log("结束对话")
            callback();
        }, 500);
    };
    TalkCommand.prototype.cancel = function (callback) {
        this.AimNPC.closeDialogue();
    };
    return TalkCommand;
}());
var CommandList = (function () {
    function CommandList() {
        this._list = [];
        this._frozen = false;
    }
    CommandList.prototype.addCommand = function (command) {
        this._list.push(command);
    };
    CommandList.prototype.cancel = function () {
        var _this = this;
        this._frozen = true;
        var command = this.currentCommand;
        engine.setTimeout(function () {
            if (_this._frozen) {
                _this._frozen = false;
            }
        }, 2000);
        if (command) {
            command.cancel(function () {
                _this._frozen = false;
            });
            this._list = [];
        }
    };
    CommandList.prototype.execute = function () {
        var _this = this;
        if (this._frozen) {
            engine.setTimeout(this.execute, 100);
            return;
        }
        var command = this._list.shift();
        this.currentCommand = command;
        if (command) {
            //console.log("执行下一命令", command)
            command.execute(function () {
                _this.execute();
            });
        }
        else {
            //console.log("全部命令执行完毕")
        }
    };
    return CommandList;
}());
var GameScene = (function (_super) {
    __extends(GameScene, _super);
    function GameScene(map) {
        var _this = _super.call(this) || this;
        /**帧事件' */
        _this.step = 10;
        _this.i = 2;
        _this.prevX = 0;
        _this.taskCondition = [];
        _this.map = map;
        _this.user = User.getInstance();
        _this.idle = new Idle(_this.user.role, User.idlelist);
        _this.walk = new Walk(_this.user.role, User.walklist);
        _this.mapMove();
        GameScene.mapOffsetX = 0;
        return _this;
    }
    GameScene.prototype.replaceamap = function (map) {
        this.map = map;
    };
    GameScene.prototype.getCurrentamap = function () {
        return this.map;
    };
    GameScene.prototype.moveTo = function (x, y, callback) {
        var _this = this;
        //console.log("开始移动")
        this.walkToDestination(x, y);
        // egret.setTimeout(function () {
        //     console.log("结束移动")
        //     callback();
        // }, this, 500)
        engine.startTick(function () {
            if (_this.map._astar._path[0] != null) {
                if (_this.user.role.x == (_this.map._astar._path[0].x) * _this.map.MapSize + 50 && _this.user.role.y == _this.map._astar._path[0].y * _this.map.MapSize + 50) {
                    _this.user.role.SetState(_this.idle);
                    callback();
                    //this.setAstar(); 
                }
            }
            return false;
        });
    };
    GameScene.prototype.stopMove = function (callback) {
        this.clearAstar();
    };
    GameScene.prototype.walkToDestination = function (DestinationX, DestinationY) {
        this.clearAstar();
        this.map._astar.setStartNode(Math.floor((this.user.role.x) / 100), Math.floor(this.user.role.y / 100));
        this.map._astar.setEndNode(Math.floor((DestinationX + GameScene.mapOffsetX) / 100), Math.floor(DestinationY / 100));
        //console.log("DestinationX" + Math.floor((DestinationX + GameScene.mapOffsetX) / 100));
        var i = this.map._astar.findPath();
        if (i == 1) {
            this.user.role.SetState(this.walk);
            //egret.Tween.removeTweens(this._player);
            this.addEventListener(engine.Event.ENTER_FRAME, this.onEnterFrame);
            this.onEnterFrame;
            //this.Move();
            i = 2;
        }
        else if (i == 0) {
            this.user.role.SetState(this.idle);
            this.clearAstar();
            i = 2;
        }
        else if (i == -1) {
            this.user.role.SetState(this.idle);
            this.clearAstar();
            i = 2;
        }
    };
    GameScene.prototype.onEnterFrame = function (event) {
        //console.log('hi');
        var n = this.map._astar._path.length;
        //console.log(n - this.i);
        if (n - this.i < 0)
            return;
        var targetX = this.map._astar._path[n - this.i].x * this.map.MapSize + this.map.MapSize / 2;
        var targetY = this.map._astar._path[n - this.i].y * this.map.MapSize + this.map.MapSize / 2;
        var dx = targetX - this.user.role.x;
        var dy = targetY - this.user.role.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.step * 2) {
            this.i++;
            if (this.i > this.map._astar._path.length) {
                this.removeEventListener(engine.Event.ENTER_FRAME, this.onEnterFrame);
                //console.log('remove');
            }
        }
        else {
            if (targetX - this.user.role.x > this.step)
                this.user.role.x += this.step;
            if (targetY - this.user.role.y > this.step)
                this.user.role.y += this.step;
            if (this.user.role.x - targetX > this.step)
                this.user.role.x -= this.step;
            if (this.user.role.y - targetY > this.step)
                this.user.role.y -= this.step;
            if (Math.abs(this.user.role.x - targetX) <= this.step) {
                this.user.role.x = targetX;
            }
            if (Math.abs(this.user.role.y - targetY) <= this.step) {
                this.user.role.y = targetY;
            }
        }
    };
    GameScene.prototype.clearAstar = function () {
        engine.Tween.removeTweens(this.user.role);
        this.map._astar.setStartNode(Math.floor(this.user.role.x / 100), Math.floor(this.user.role.y / 100));
        this.map._astar.empty();
        this.i = 1;
    };
    /***地图 */
    GameScene.prototype.mapMove = function () {
        var _this = this;
        this.map.parent.touchEnable = true;
        this.map.parent.addEventListener(engine.MyTouchEvent.TOUCH_BEGIN, function (e) {
            _this.prevX = e.stageX;
            //this.offsetx=e.stageX-this._bg.x;
            _this.map.parent.addEventListener(engine.MyTouchEvent.TOUCH_MOVE, _this.onMove);
            //console.log("mapmove");
        });
        this.map.parent.addEventListener(engine.MyTouchEvent.TOUCH_END, function () {
            _this.removeEventListener(engine.MyTouchEvent.TOUCH_MOVE, _this.onMove);
        });
    };
    GameScene.prototype.onMove = function (e) {
        //this._bg.x+=offsetx;
        //console.log("onMove");
        this.offsetx = this.prevX - e.stageX;
        //console.log("mapMove");
        if (this.offsetx > 100) {
            engine.Tween.get(this.map.parent).to({ x: -360 }, 200);
            GameScene.mapOffsetX = 360;
        }
        if (this.offsetx < -100) {
            //console.log("12345789465413213212313");
            // engine.Tween.get(this.map.parent).to({ x: 0 }, 200)
            GameScene.mapOffsetX = 0;
        }
    };
    GameScene.prototype.addconditionObserver = function (tempTaskCondition) {
        this.taskCondition.push(tempTaskCondition);
    };
    GameScene.prototype.notify = function (id) {
        for (var _i = 0, _a = this.taskCondition; _i < _a.length; _i++) {
            var i = _a[_i];
            i.onchange(id);
            console.log("杀怪了");
        }
        //var task=TaskService.getIntance()._tasklist[id];
        //TaskService.getIntance().notify().
    };
    return GameScene;
}(engine.DisplayObjectContainer));
GameScene.mapOffsetX = 0;
var SecneManager = (function () {
    function SecneManager() {
        this.Scenelist = new Array();
    }
    SecneManager.prototype.addScene = function (scene) {
        this.Scenelist.push(scene);
        if (this.Scenelist.length == 1) {
            this.currentScene = this.Scenelist[0];
        }
    };
    SecneManager.prototype.removeScene = function (scene) {
        var i = this.Scenelist.indexOf(scene);
        this.Scenelist.splice(i);
    };
    SecneManager.prototype.setCurrentScene = function (scene) {
        this.currentScene = scene;
        this.Scenelist.forEach(function (element) {
            if (element == scene)
                return;
        });
        this.Scenelist.push(scene);
    };
    return SecneManager;
}());
var LayerType;
(function (LayerType) {
    LayerType[LayerType["UILayer"] = 0] = "UILayer";
    LayerType[LayerType["DetailLayer"] = 1] = "DetailLayer";
})(LayerType || (LayerType = {}));
var UIManager = (function (_super) {
    __extends(UIManager, _super);
    function UIManager() {
        var _this = _super.call(this) || this;
        _this.UILayer = new engine.DisplayObjectContainer();
        _this.DetailLayer = new engine.DisplayObjectContainer();
        _this.addChild(_this.UILayer);
        _this.addChild(_this.DetailLayer);
        return _this;
    }
    UIManager.prototype.addLayer = function (whichType, addWhat) {
        switch (whichType) {
            case LayerType.DetailLayer:
                this.DetailLayer.addChild(addWhat);
                addWhat.x = GameScene.mapOffsetX;
                break;
            case LayerType.UILayer:
                this.UILayer.addChild(addWhat);
                addWhat.x = GameScene.mapOffsetX;
                break;
        }
    };
    UIManager.prototype.removeLayer = function (whichType, addWhat) {
        switch (whichType) {
            case LayerType.DetailLayer:
                this.DetailLayer.addChild(addWhat);
                this.DetailLayer.removeChild(addWhat);
                break;
            case LayerType.UILayer:
                this.UILayer.addChild(addWhat);
                this.UILayer.removeChild(addWhat);
                break;
        }
    };
    UIManager.prototype.switchIndex = function (swithchFrom, switchTo) {
        //this.swapChildren(LayerType,)
        var from = this.find(swithchFrom);
        var to = this.find(switchTo);
        this.swapChildren(from, to);
    };
    UIManager.prototype.find = function (temp) {
        var container = new engine.DisplayObjectContainer();
        switch (temp) {
            case LayerType.DetailLayer:
                container = this.DetailLayer;
                break;
            case LayerType.UILayer:
                container = this.UILayer;
                break;
        }
        return container;
    };
    return UIManager;
}(engine.DisplayObjectContainer));
var GameManager = (function () {
    function GameManager() {
        GameManager.count++;
        if (GameManager.count > 1)
            throw 'singleton!!';
        this.secneManager = new SecneManager();
        this.UIManager = new UIManager();
        this.effectManager = new EffectManager();
    }
    GameManager.getInstance = function () {
        if (this.instance == null)
            this.instance = new GameManager();
        return this.instance;
    };
    return GameManager;
}());
GameManager.count = 0;
var EffectManager = (function () {
    function EffectManager() {
    }
    return EffectManager;
}());
var Idle = (function () {
    function Idle(pperson, idle) {
        var _this = this;
        this.count = -1;
        this.i = 0;
        this.PlayIdle = function () {
            _this.count++;
            _this.i++;
            console.log(_this.Idlelist.length);
            if (_this.count >= _this.Idlelist.length)
                _this.count = 0;
            //var na=(i+10000).toString()+"_png";
            //console.log("Idle");
            if (_this.i == 10) {
                _this.person._role.src = _this.Idlelist[_this.count];
                _this.i = 0;
            }
            return true;
        };
        this.person = pperson;
        this.Idlelist = idle;
    }
    Idle.prototype.onEnter = function () {
        this.temp = this.PlayIdle;
        engine.startTick(this.temp);
    };
    Idle.prototype.onExit = function () {
        this.temp = this.PlayIdle;
        engine.stopTick(this.temp);
        //console.log("IdleExit");
    };
    return Idle;
}());
var Role = (function (_super) {
    __extends(Role, _super);
    function Role() {
        var _this = _super.call(this) || this;
        _this._role = new engine.Bitmap();
        _this.idlelist = [];
        _this.walklist = [];
        return _this;
    }
    Role.prototype.SetState = function (e) {
        if (this._State != e) {
            this._State.onExit();
        }
        this._State = e;
        this._State.onEnter();
    };
    Role.prototype.call = function (idlelist, walklist) {
        this.idlelist = idlelist;
        this.walklist = walklist;
        this._role.src = "/Game/assets/10000.png";
        tool.anch(this._role);
        this.addChild(this._role);
        var idle = new Idle(this, this.idlelist);
        // console.log(this.idlelist.length)
        this._State = idle;
        this._State.onEnter();
    };
    return Role;
}(engine.DisplayObjectContainer));
var Walk = (function () {
    function Walk(pperson, walk) {
        this.Walkcount = -1;
        this.i = 0;
        this.person = pperson;
        this.Walklist = walk;
    }
    Walk.prototype.onEnter = function () {
        this.temp = this.PlayWalk;
        engine.startTick(this.temp);
    };
    Walk.prototype.onExit = function () {
        this.temp = this.PlayWalk;
        engine.stopTick(this.temp);
    };
    Walk.prototype.PlayWalk = function () {
        this.Walkcount++;
        this.i++;
        if (this.Walkcount >= this.Walklist.length)
            this.Walkcount = 0;
        if (this.i == 10) {
            this.person._role.src = this.Walklist[this.Walkcount];
            this.i = 0;
        }
        //  console.log("Walk");
        //  console.log(this.Walklist[this.Walkcount]);
        return true;
    };
    return Walk;
}());
var DialoguePanel = (function (_super) {
    __extends(DialoguePanel, _super);
    function DialoguePanel() {
        var _this = _super.call(this) || this;
        _this._container = new engine.DisplayObjectContainer();
        _this._container.width = 300;
        _this._container.height = 425;
        _this._container.x = 0;
        _this._container.y = 0;
        _this._textfield = new engine.TextField();
        _this._textfield.fontSize = 36;
        _this._textfield.width = 220;
        _this._textfield.height = 345;
        _this._textfield.color = "0X00000";
        _this._textfield.x = 40;
        _this._textfield.y = 40;
        _this._firstbutton = new engine.Bitmap();
        _this._firstbutton.scaleX = 0.4;
        _this._firstbutton.scaleY = 0.4;
        _this._firstbutton.x = 40;
        _this._firstbutton.y = 345;
        _this._giveUpButton = new engine.Bitmap();
        _this._giveUpButton.scaleX = 0.4;
        _this._giveUpButton.scaleY = 0.4;
        _this._giveUpButton.x = 110;
        _this._giveUpButton.y = 345;
        _this._returnButton = new engine.Bitmap();
        _this._returnButton.scaleX = 0.4;
        _this._returnButton.scaleY = 0.4;
        _this._returnButton.x = 180;
        _this._returnButton.y = 345;
        _this._background = new engine.Bitmap();
        _this._background.width = _this._container.width;
        _this._background.height = _this._container.height;
        _this._container.addChild(_this._background);
        _this._container.addChild(_this._textfield);
        _this._container.addChild(_this._firstbutton);
        _this._container.addChild(_this._giveUpButton);
        _this._container.addChild(_this._returnButton);
        return _this;
        //this.addChild(this._container);
    }
    DialoguePanel.prototype.call = function (task, fromself, toself) {
        this.task = task;
        this._background.src = "Taskbg_png";
        //console.log("Dialogue.call");
        this._textfield.text = this.task.getname();
        this._textfield.text += "\n";
        this._textfield.text += this.task.getdris();
        //console.log(this._textfield.text);
        this._firstbutton.src = this.getfirsttexture(this.task, fromself, toself);
        this._giveUpButton.src = this.getGiveUpTexture(this.task, fromself, toself);
        this._returnButton.src = DialoguePanel.texturelist["退出"];
        this.addChild(this._container);
        this.firstButtonlistener();
        this.giveUpButtonlistener(this.task, fromself, toself);
        this.returnButtonlistener();
    };
    DialoguePanel.prototype.firstButtonlistener = function () {
        var _this = this;
        this._firstbutton.touchEnable = true;
        this._firstbutton.addEventListener(engine.MyTouchEvent.TouchClick, function () {
            if (_this._firstbutton.src == DialoguePanel.texturelist["接受"]) {
                TaskService.getIntance().accept(_this.task.getid());
                _this._firstbutton.src = DialoguePanel.texturelist["不能接受"];
                _this._giveUpButton.src = DialoguePanel.texturelist["放弃"];
                //console.log("任务接受");
                //console.log(task.getstatus());
            }
            if (_this._firstbutton.src == DialoguePanel.texturelist["提交"]) {
                TaskService.getIntance().finish(_this.task.getid());
                _this._firstbutton.src = DialoguePanel.texturelist["不能提交"];
                _this._giveUpButton.src = DialoguePanel.texturelist["不能放弃"];
                //console.log("任务完成");
                //console.log(task.getstatus());
                //this.call();
            }
        });
    };
    DialoguePanel.prototype.giveUpButtonlistener = function (task, fromself, toself) {
        var _this = this;
        this._giveUpButton.touchEnable = true;
        this._giveUpButton.addEventListener(engine.MyTouchEvent.TouchClick, function () {
            if (_this._giveUpButton.src == DialoguePanel.texturelist["放弃"]) {
                if (task.getstatus() == statusType.Working || task.getstatus() == statusType.Cancomplete) {
                    TaskService.getIntance().Canaccept(task.getid());
                    _this._giveUpButton.src = DialoguePanel.texturelist["不能放弃"];
                    if (fromself && !toself)
                        _this._firstbutton.src = DialoguePanel.texturelist["接受"];
                    if (toself && !fromself)
                        _this._firstbutton.src = DialoguePanel.texturelist["不能提交"];
                    if (toself && fromself)
                        _this._firstbutton.src = DialoguePanel.texturelist["接受"];
                    console.log("任务已放弃");
                    console.log(task.getstatus());
                }
            }
        });
    };
    DialoguePanel.prototype.returnButtonlistener = function () {
        var _this = this;
        this._returnButton.touchEnable = true;
        this._returnButton.addEventListener(engine.MyTouchEvent.TouchClick, function () {
            _this.addChild(_this._container); //不确定上一次移除了几次，再加一个然后remove
            _this.removeChild(_this._container);
        });
    };
    DialoguePanel.prototype.getfirsttexture = function (task, fromself, toself) {
        var str;
        if (task.getstatus() == statusType.Acceptable && fromself)
            str = DialoguePanel.texturelist["接受"];
        if (task.getstatus() == statusType.Working && fromself)
            str = DialoguePanel.texturelist["不能接受"];
        if (task.getstatus() == statusType.Unacceptable && fromself)
            str = DialoguePanel.texturelist["不能接受"];
        if (task.getstatus() == statusType.Cancomplete && fromself)
            str = DialoguePanel.texturelist["不能接受"];
        if (task.getstatus() == statusType.Cancomplete && toself)
            str = DialoguePanel.texturelist["提交"];
        if (task.getstatus() == statusType.Working && toself)
            str = DialoguePanel.texturelist["不能提交"];
        if (task.getstatus() == statusType.Acceptable && toself)
            str = DialoguePanel.texturelist["不能提交"];
        if (task.getstatus() == statusType.Unacceptable && toself)
            str = DialoguePanel.texturelist["不能提交"];
        return str;
    };
    DialoguePanel.prototype.getGiveUpTexture = function (task, fromself, toself) {
        var str;
        if (fromself) {
            if (task.getstatus() == statusType.Acceptable && fromself)
                str = DialoguePanel.texturelist["不能放弃"];
            // if(task.getstatus()==statusType.Acceptable && !fromself)
            //     str=DialoguePanel.texturelist["不能放弃"];
            if (task.getstatus() == statusType.Working && fromself)
                str = DialoguePanel.texturelist["放弃"];
            // if(task.getstatus()==statusType.Working && !fromself)
            //     str=DialoguePanel.texturelist["不能放弃"];
            if (task.getstatus() == statusType.Cancomplete && fromself)
                str = DialoguePanel.texturelist["放弃"];
            // if(task.getstatus()==statusType.Cancomplete && !fromself)
            //     str=DialoguePanel.texturelist["不能放弃"];
        }
        if (toself) {
            if (task.getstatus() == statusType.Acceptable && toself)
                str = DialoguePanel.texturelist["不能放弃"];
            if (task.getstatus() == statusType.Working && toself)
                str = DialoguePanel.texturelist["放弃"];
            // if(task.getstatus()==statusType.Working && !toself)
            //     str=DialoguePanel.texturelist["不能放弃"];
            if (task.getstatus() == statusType.Cancomplete && toself)
                str = DialoguePanel.texturelist["放弃"];
            // if(task.getstatus()==statusType.Cancomplete && !toself)
            //     str=DialoguePanel.texturelist["不能放弃"];
        }
        return str;
    };
    return DialoguePanel;
}(engine.DisplayObjectContainer));
DialoguePanel.texturelist = {
    "接受": "UI01_png",
    "退出": "UI02_png",
    "提交": "UI03_png",
    "不能提交": "UI04_png",
    "放弃": "UI05_png",
    "不能放弃": "UI06_png",
    "不能接受": "UI07_png"
};
var NPC = (function (_super) {
    __extends(NPC, _super);
    function NPC(id) {
        var _this = _super.call(this) || this;
        _this._tasklist = [];
        //打开对话框
        _this.dialogue = new DialoguePanel();
        _this.IsDialogueOpen = false;
        _this.NPCField = new engine.DisplayObjectContainer();
        _this._id = id;
        //NPC形象加载  图片格式有要求305*280；
        _this._role = new Role();
        _this._role.call(_this.CreatNPC(id), _this.CreatNPC(id));
        _this._role.x = 170;
        _this._role.y = 170;
        _this.NPCField.addChild(_this._role);
        _this.NPCField.width = _this._role.width;
        _this.NPCField.height = _this._role.height;
        _this._name = NPC.NPC_LIST[id].name;
        //NPC头上任务反馈
        _this.taskresponse = new engine.Bitmap();
        _this.taskresponse.scaleX = 0.5;
        _this.taskresponse.scaleY = 0.5;
        _this.taskresponse.x = -50;
        _this.taskresponse.y = -180;
        _this.NPCField.addChild(_this.taskresponse);
        //namelabel相关设置
        _this.namelabel = new engine.TextField();
        _this.namelabel.x = -30;
        _this.namelabel.y = 70;
        _this.namelabel.color = "0X00000";
        _this.namelabel.fontSize = 40;
        _this.NPCField.addChild(_this.namelabel);
        _this.addChild(_this.NPCField);
        return _this;
    }
    //调用函数
    NPC.prototype.call = function () {
        this.namelabel.text = this._name;
        this.getTask();
        this.responseTask();
        this.clickNPC();
        //this.addChild(this.dialogue);
        GameManager.getInstance().UIManager.addLayer(LayerType.UILayer, this.dialogue);
    };
    //鼠标点击
    NPC.prototype.clickNPC = function () {
        var _this = this;
        this._role.touchEnable = true;
        this._role.addEventListener(engine.MyTouchEvent.TouchClick, function () {
            // this.getTask();
            // this.responseTask();
            var list = new CommandList();
            var walk = new WalkCommand(_this.x - GameScene.mapOffsetX, _this.y); ///////////////////////////////////////////////////
            var talk = new TalkCommand(_this);
            list.addCommand(walk);
            list.addCommand(talk);
            list.execute();
            //console.log("this.role chick");
            _this.getTask();
            _this.responseTask();
        });
    };
    NPC.prototype.OpenDialogue = function () {
        var task = this.getOptimalTask();
        var fromself = false;
        var toself = false;
        if (task.getfromNpcId() == this._id)
            fromself = true;
        if (task.gettoNpcId() == this._id)
            toself = true;
        // this.dialogue.anchorOffsetX = this.dialogue.width / 2;
        // this.dialogue.anchorOffsetY = this.dialogue.height / 2;
        // this.dialogue.x = this.parent.stage.width / 2 - this.x;
        // this.dialogue.y = this.parent.stage.height / 2 - this.y;
        this.dialogue.call(task, fromself, toself);
        //this.addChild(this.dialogue._container);
        GameManager.getInstance().UIManager.addLayer(LayerType.UILayer, this.dialogue._container);
        this.IsDialogueOpen = true;
        this.getTask();
        this.responseTask();
    };
    NPC.prototype.closeDialogue = function () {
        if (this.IsDialogueOpen = true)
            // this.removeChild(this.dialogue._container);
            GameManager.getInstance().UIManager.removeLayer(LayerType.UILayer, this.dialogue._container);
        else
            console.error("对话框并没有打开，无法关闭");
    };
    NPC.prototype.getOptimalTask = function () {
        var task;
        for (var s = 0; s < this._tasklist.length; s++) {
            //优先查找自己能结算的任务
            if (this._tasklist[s].gettoNpcId() == this._id) {
                switch (this._tasklist[s].getstatus()) {
                    case statusType.Unacceptable:
                        break;
                    case statusType.Acceptable:
                        break;
                    case statusType.Cancomplete:
                        task = this._tasklist[s];
                        //console.log("结算");
                        break;
                    case statusType.Complete:
                        //task=this._tasklist[s];
                        break;
                    case statusType.Working:
                        //task=this._tasklist[s];
                        break;
                }
            }
        }
        if (task == null) {
            for (var s = 0; s < this._tasklist.length; s++) {
                //次选查找自己能发送的任务
                if (this._tasklist[s].getfromNpcId() == this._id) {
                    switch (this._tasklist[s].getstatus()) {
                        case statusType.Unacceptable:
                            break;
                        case statusType.Acceptable:
                            task = this._tasklist[s];
                            //console.log("提交");
                            break;
                        case statusType.Cancomplete:
                            break;
                        case statusType.Complete:
                            break;
                        case statusType.Working:
                            break;
                    }
                }
            }
        }
        //身上既没有能发出的任务也没有能结算的任务，随意一个任务
        if (task == null) {
            task = this._tasklist[0];
        }
        return task;
    };
    NPC.prototype.CreatNPC = function (id) {
        var Animationlist = [];
        for (var s = 0; s < NPC.NPC_LIST[id].Flashlist; s++) {
            if (s < 10)
                Animationlist.push("NPC" + id + "_0" + s + "" + "_png");
            if (s > 10)
                Animationlist.push("NPC" + id + "_" + s + "" + "_png");
        }
        return Animationlist;
    };
    NPC.prototype.getTask = function () {
        var _this = this;
        var NPCRule = function (tasklist) {
            var temptasklist = [];
            for (var id in tasklist) {
                var task = tasklist[id];
                if (task.gettoNpcId() == _this._id) {
                    temptasklist.push(task);
                }
                if (task.getfromNpcId() == _this._id) {
                    temptasklist.push(task);
                }
            }
            return temptasklist;
        };
        this._tasklist = TaskService.getIntance().getTaskByCustomRule(NPCRule);
    };
    NPC.prototype.onchange = function (task) {
        // for(var s of this._tasklist){
        //     if(s.getid()==task.getid()){
        //         if(s.getfromNpcId() == this._id)
        //             console.log(this._name+":发出任务");
        //         if(s.gettoNpcId() == this._id)
        //             console.log(this._name+":完成任务");
        //     }
        // }
        this.getTask();
        this.responseTask();
    };
    // public addTask(task:Task){
    //     this._tasklist.push(task);
    // }
    //是否身上有未发出的任务
    NPC.prototype.hasSendTask = function () {
        for (var _i = 0, _a = this._tasklist; _i < _a.length; _i++) {
            var s = _a[_i];
            if (s.getfromNpcId() == this._id && s.getstatus() == statusType.Acceptable) {
                return true;
            }
        }
        return false;
    };
    //是否身上有未提交的任务
    NPC.prototype.hasReceiveTask = function () {
        for (var _i = 0, _a = this._tasklist; _i < _a.length; _i++) {
            var s = _a[_i];
            // if(s.gettoNpcId()==this._id && s.getstatus()==statusType.Working){
            //    return true;
            // }
            if (s.gettoNpcId() == this._id && s.getstatus() == statusType.Cancomplete) {
                return true;
            }
        }
        return false;
    };
    NPC.prototype.responseTask = function () {
        /**缺最优算法 */
        var s = this.getOptimalTask();
        //任务发出不可接受，没有表情
        if (s.getstatus() == statusType.Unacceptable) {
            this.taskresponse.src = "0_png";
            //console.log("0.png");
        }
        //任务发出可接受，蓝色问号
        if (s.getfromNpcId() == this._id && s.getstatus() == statusType.Acceptable) {
            this.taskresponse.src = "1_png";
            //console.log("1.png");
        }
        //任务进行中，灰色问号
        if (s.gettoNpcId() == this._id && s.getstatus() == statusType.Working) {
            this.taskresponse.src = "2_png";
            //console.log("2.png");
        }
        //任务可完成但没提交，金色问号
        if (s.gettoNpcId() == this._id && s.getstatus() == statusType.Cancomplete) {
            this.taskresponse.src = "3_png";
            //console.log("3.png");
        }
        //任务提交完成，没有表情
        if (s.gettoNpcId() == this._id && s.getstatus() == statusType.Complete) {
            this.taskresponse.src = "0_png";
            //console.log("0.png");
        }
        if (!this.hasSendTask() && !this.hasReceiveTask())
            this.taskresponse.src = "0_png";
    };
    return NPC;
}(engine.DisplayObjectContainer));
NPC.NPC_LIST = {
    "01": { name: "甘宁", Flashlist: 6 },
    "02": { name: "陆逊", Flashlist: 4 } //陆逊
};
var Task = (function () {
    function Task(id, name, dris, fromNpcId, toNpcId, total, condition, toTaskid) {
        this._current = 0;
        this._total = -1;
        this._toTaskid = toTaskid;
        this._id = id;
        this._name = name;
        this._dris = dris;
        this._fromNpcId = fromNpcId;
        this._toNpcId = toNpcId;
        this._total = total;
        this._current = 0;
        this._condition = condition;
        this._status = statusType.Unacceptable;
    }
    // private setstatus(){
    //     if(this._preid==null)
    //         this._status = statusType.Acceptable;
    //     if(this._preid!=null){
    //         var task=new Task()
    //         if()
    //         this._status = statusType.Acceptable;
    //     }
    // }
    Task.prototype.getdris = function () {
        return this._dris;
    };
    Task.prototype.getid = function () {
        return this._id;
    };
    Task.prototype.getname = function () {
        return this._name;
    };
    Task.prototype.getfromNpcId = function () {
        return this._fromNpcId;
    };
    Task.prototype.gettoNpcId = function () {
        return this._toNpcId;
    };
    Task.prototype.getstatus = function () {
        return this._status;
    };
    Task.prototype.finish = function () {
        // console.log(this._status);
        this._status = statusType.Complete;
        // console.log(this._status);
        //   this._condition.onsubmit(this);
        if (this._toTaskid != null) {
            TaskService.getIntance().Canaccept(this._toTaskid);
        }
    };
    Task.prototype.accept = function () {
        // console.log(this._status);
        this._status = statusType.Working;
        // console.log(this._status);
        this._condition.onAccept(this);
    };
    Task.prototype.Canaccept = function () {
        // console.log(this._status);
        this._status = statusType.Acceptable;
        // console.log(this._status);
    };
    Task.prototype.Canfinish = function () {
        // console.log(this._status);
        this._status = statusType.Cancomplete;
        // console.log(this._status);
    };
    Task.prototype.getcurrent = function () {
        return this._current;
    };
    Task.prototype.setcurrent = function () {
        this._current++;
        this.CheckStatus();
    };
    Task.prototype.CheckStatus = function () {
        if (this._status == statusType.Acceptable)
            this._status = statusType.Working;
        if (this._status == statusType.Working) {
            if (this._current >= this._total) {
                console.error(this._name + "的this._current>this._total");
                this._status = statusType.Cancomplete;
            }
            TaskService.getIntance().notify(this._id);
        }
    };
    return Task;
}());
// preid:string,
Task.Task_LIST = {
    "001": { name: "初识冒险者",
        dris: "和陆逊对话",
        fromNPCid: "01",
        toNPCid: "02",
        TaskCondition: { type: "NPCTalkTaskCondition", target: null, total: 1 },
        toid: "002" },
    "002": { name: "战斗",
        dris: "攻打强敌1次",
        fromNPCid: "02",
        toNPCid: "01",
        //total:10,
        TaskCondition: { type: "KillMonsterTaskCondition", target: "monster001", total: 1 },
        toid: null } //陆逊
};
var NPCTalkTaskCondition = (function () {
    function NPCTalkTaskCondition() {
    }
    NPCTalkTaskCondition.prototype.onAccept = function (task) {
        task.setcurrent();
        //    console.log(task.getcurrent());
    };
    return NPCTalkTaskCondition;
}());
var KillMonsterTaskCondition = (function () {
    function KillMonsterTaskCondition(monsterID) {
        this.monsterID = monsterID;
    }
    KillMonsterTaskCondition.prototype.onAccept = function (task) {
        this.task = task;
        GameManager.getInstance().secneManager.currentScene.addconditionObserver(this);
    };
    // onsubmit(task: TaskConditionContext) {
    // }
    KillMonsterTaskCondition.prototype.onchange = function (monsterID) {
        if (this.monsterID == monsterID)
            this.task.setcurrent();
    };
    return KillMonsterTaskCondition;
}());
var statusType;
(function (statusType) {
    statusType[statusType["Unacceptable"] = 0] = "Unacceptable";
    statusType[statusType["Acceptable"] = 1] = "Acceptable";
    statusType[statusType["Working"] = 2] = "Working";
    statusType[statusType["Cancomplete"] = 3] = "Cancomplete";
    statusType[statusType["Complete"] = 4] = "Complete";
})(statusType || (statusType = {}));
var TaskPanel = (function (_super) {
    __extends(TaskPanel, _super);
    function TaskPanel() {
        var _this = _super.call(this) || this;
        _this._tasklist = [];
        _this._textfield = new engine.TextField();
        _this._textfield.x = 20;
        _this._textfield.y = 40;
        _this._textfield.width = 360;
        _this._textfield.height = 200;
        _this._returnButton = new engine.Bitmap();
        // this._returnButton.anchorOffsetX=this._returnButton.width/2;
        // this._returnButton.anchorOffsetY=this._returnButton.height/2;
        _this._returnButton.scaleX = 0.4;
        _this._returnButton.scaleY = 0.4;
        _this._returnButton.x = 160;
        _this._returnButton.y = 230;
        _this._background = new engine.Bitmap();
        _this._background.width = 400;
        _this._background.height = 280;
        _this._container = new engine.DisplayObjectContainer();
        _this._container.width = _this._background.width;
        _this._container.height = _this._background.height;
        _this._container.addChild(_this._background);
        _this._container.addChild(_this._returnButton);
        _this._container.addChild(_this._textfield);
        //this.addChild(this._container);
        _this.getTask();
        _this.returnButtonListener();
        return _this;
    }
    TaskPanel.prototype.call = function () {
        this.addChild(this._container);
        this.getTask();
        //var str="001";
        //TaskService.getIntance().Canfinish(str);
        this._textfield.text = this.getText();
        this._background.src = "/Game/assets/TaskPanelbg.png";
        this._returnButton.src = DialoguePanel.texturelist["退出"];
        console.log("TaskPanel.call");
    };
    TaskPanel.prototype.returnButtonListener = function () {
        var _this = this;
        this._returnButton.touchEnable = true;
        this._returnButton.addEventListener(engine.MyTouchEvent.TouchClick, function () {
            console.log("removeChild");
            _this.removeChild(_this._container);
            //this.parent.removeChild(this);
        });
    };
    TaskPanel.prototype.getText = function () {
        var str = "";
        for (var _i = 0, _a = this._tasklist; _i < _a.length; _i++) {
            var task = _a[_i];
            str += task.getname() + "      ";
            if (task.getstatus() == statusType.Working)
                str += "执行中\n";
            if (task.getstatus() == statusType.Cancomplete)
                str += "可完成\n";
        }
        return str;
    };
    TaskPanel.prototype.onchange = function (task) {
        for (var _i = 0, _a = this._tasklist; _i < _a.length; _i++) {
            var s = _a[_i];
            if (s.getfromNpcId == task.getfromNpcId)
                console.log(this + "发出任务");
            if (s.gettoNpcId == task.gettoNpcId)
                console.log(this + "完成任务");
        }
    };
    TaskPanel.prototype.getTask = function () {
        var NPCRule = function (tasklist) {
            var temptasklist = [];
            for (var id in tasklist) {
                var task = tasklist[id];
                if (task.getstatus() == statusType.Working) {
                    temptasklist.push(task);
                }
                if (task.getstatus() == statusType.Cancomplete) {
                    temptasklist.push(task);
                }
            }
            return temptasklist;
        };
        this._tasklist = TaskService.getIntance().getTaskByCustomRule(NPCRule);
    };
    return TaskPanel;
}(engine.DisplayObjectContainer));
var TaskService = (function () {
    function TaskService() {
        //private _tasklist:Task[]=[];
        this._observerlist = [];
        this._tasklist = {};
        TaskService.count++;
        if (TaskService.count > 1)
            throw 'singleton!!';
    }
    TaskService.getIntance = function () {
        if (TaskService.instance == null) {
            TaskService.instance = new TaskService();
        }
        return TaskService.instance;
    };
    TaskService.prototype.getTaskByCustomRule = function (Rule) {
        return Rule(this._tasklist);
    };
    TaskService.prototype.addTask = function (task) {
        this._tasklist[task.getid()] = task;
    };
    TaskService.prototype.addObserver = function (observer) {
        this._observerlist.push(observer);
    };
    TaskService.prototype.finish = function (id) {
        if (this._tasklist[id] == null) {
            throw '没有这个任务';
        }
        if (this._tasklist[id].getstatus() == statusType.Cancomplete) {
            this._tasklist[id].finish();
            this.notify(id);
        }
    };
    TaskService.prototype.accept = function (id) {
        if (this._tasklist[id] == null) {
            throw '没有这个任务';
        }
        if (this._tasklist[id].getstatus() == statusType.Acceptable) {
            this._tasklist[id].accept();
            this.notify(id);
        }
    };
    TaskService.prototype.Canaccept = function (id) {
        if (this._tasklist[id] == null) {
            throw '没有这个任务';
        }
        //if(this._tasklist[id].getstatus()==statusType.Unacceptable){
        this._tasklist[id].Canaccept();
        this.notify(id);
        //}
    };
    TaskService.prototype.Canfinish = function (id) {
        if (this._tasklist[id] == null) {
            throw '没有这个任务';
        }
        if (this._tasklist[id].getstatus() == statusType.Working) {
            this._tasklist[id].Canfinish();
            this.notify(id);
        }
    };
    TaskService.prototype.notify = function (id) {
        for (var _i = 0, _a = this._observerlist; _i < _a.length; _i++) {
            var s = _a[_i];
            s.onchange(this._tasklist[id]);
        }
    };
    return TaskService;
}());
TaskService.count = 0;
var Bignumber = (function () {
    function Bignumber() {
        this.upNumber = 0;
        this.downNumber = 0;
    }
    Bignumber.prototype.setNumber = function (num) {
        if (num > Bignumber.fold) {
            var s = Math.floor(num / Bignumber.fold);
            this.upNumber = s;
            s = num % Bignumber.fold;
            this.downNumber = s;
        }
        else {
            this.downNumber = num;
        }
    };
    Bignumber.prototype.setBigNumber = function (bignum) {
        this.upNumber = bignum.upNumber;
        this.downNumber = bignum.downNumber;
    };
    Bignumber.prototype.addNumber = function (num) {
        if (num >= Bignumber.fold) {
            var s = Math.floor(num / Bignumber.fold);
            this.upNumber += s;
            s = num % Bignumber.fold;
            this.downNumber += s;
        }
        if (num < Bignumber.fold && num + this.downNumber >= Bignumber.fold) {
            this.upNumber++;
            this.downNumber = this.downNumber + num - Bignumber.fold;
        }
        if (num < Bignumber.fold && num + this.downNumber < Bignumber.fold) {
            this.downNumber = this.downNumber + num;
        }
    };
    Bignumber.prototype.addBigNumber = function (bignum) {
        this.upNumber += bignum.upNumber;
        this.downNumber += bignum.downNumber;
        if (this.downNumber > Bignumber.fold) {
            var s = Math.floor(this.downNumber / Bignumber.fold);
            this.upNumber += s;
            s = this.downNumber % Bignumber.fold;
            this.downNumber = s;
        }
    };
    Bignumber.prototype.subtractNumber = function (num) {
        var UP = this.upNumber;
        var DOWN = this.downNumber;
        if (num < this.downNumber) {
            this.downNumber -= num;
            return;
        }
        if (num > this.downNumber) {
            this.upNumber -= 1;
            var s = Bignumber.fold + this.downNumber - num;
            for (; this.upNumber > 0 && s < 0; this.upNumber--) {
                s += Bignumber.fold;
            }
            if (s < 0 && this.upNumber <= 0) {
                console.warn("number>this数据不足");
                this.upNumber = UP;
                this.downNumber = DOWN;
                return;
            }
            this.downNumber = s;
        }
    };
    Bignumber.prototype.subtractBigNumber = function (bignum) {
        if (this.upNumber < bignum.upNumber) {
            console.warn("Bignumber>this数据不足");
            return;
        }
        if (this.downNumber >= bignum.downNumber) {
            this.upNumber -= bignum.upNumber;
            this.downNumber -= bignum.downNumber;
        }
        else {
            this.upNumber -= bignum.upNumber;
            this.upNumber--;
            this.downNumber += Bignumber.fold;
            this.downNumber -= bignum.downNumber;
        }
    };
    Bignumber.prototype.toString = function () {
        var str = "";
        str = (this.upNumber * Bignumber.fold + this.downNumber).toString();
        return str;
    };
    return Bignumber;
}());
Bignumber.fold = 1;
// var Cache: MethodDecorator = (target: any, propertyName, desc: PropertyDescriptor) => {
//     const getter = desc.get;
//     desc.get = function () {
//         //console.log(target);//引用时的类
//         //console.log(propertyName)//接下来的函数
//         //console.log(this);
//         if (this["fightHeroPowerCache"] != null && !this["flag"]) {
//             return this["fightHeroPowerCache"];
//         } else {
//             this["fightHeroPowerCache"] = getter.apply(this);
//             //return getter.apply(this);
//         }
//         //console.log(this["fightHeroPowerCache"]);
//         return this["fightHeroPowerCache"];
//     }
//     return desc;
// }
var Hero = (function (_super) {
    __extends(Hero, _super);
    function Hero() {
        var _this = _super.call(this) || this;
        _this.level = 0;
        _this.physique = 0; //体质
        _this.equipmentCurrent = 0;
        // get Atk() {
        //     var result = 0;
        //     this.equipments.forEach(equipment => result += equipment.Atk)
        //     return result;
        // }
        _this._cacheHeroFightPower = 0;
        _this.flag = false;
        _this.tempid = 0;
        _this.exp = new Bignumber();
        _this.isInTeam = false;
        _this.equipments = [];
        Hero.Id++;
        _this.properties = new Property();
        _this.tempid = Hero.Id;
        //LayoutController.getIntance().addLayer(LayerType.UILayer, this.properties._bitmap);
        _this.addChild(_this.properties._bitmap);
        return _this;
    }
    Hero.prototype.getClassName = function () { return "Hero"; };
    Hero.prototype.getQualityDescript = function () { return heroQualitySort[this.quality]; };
    Object.defineProperty(Hero.prototype, "maxHP", {
        // getAtkDiscript(){return this.properties.atkDiscript;}
        // getDefDiscript(){return this.properties.defDiscript;}
        get: function () {
            var maxhp;
            switch (this.quality) {
                case heroQualitySort.A:
                    maxhp = this.physique * 0.7;
                    break;
                case heroQualitySort.B:
                    maxhp = this.physique * 0.6;
                    break;
                case heroQualitySort.C:
                    maxhp = this.physique * 0.5;
                    break;
                case heroQualitySort.S:
                    maxhp = this.physique * 0.8;
                    break;
            }
            return maxhp;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Hero.prototype, "Atk", {
        get: function () {
            var atk = 0;
            switch (this.quality) {
                case heroQualitySort.A:
                    atk = this.properties.initialAtk + this.level * 0.7;
                    break;
                case heroQualitySort.B:
                    atk = this.properties.initialAtk + this.level * 0.6;
                    break;
                case heroQualitySort.C:
                    atk = this.properties.initialAtk + this.level * 0.5;
                    break;
                case heroQualitySort.S:
                    atk = this.properties.initialAtk + this.level * 0.8;
                    break;
            }
            this.equipments.forEach(function (equipment) { return atk += equipment.Atk; });
            return atk;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Hero.prototype, "Def", {
        get: function () {
            var def = 0;
            switch (this.quality) {
                case heroQualitySort.A:
                    def = this.properties.initialDef + this.level * 0.7;
                    break;
                case heroQualitySort.B:
                    def = this.properties.initialDef + this.level * 0.6;
                    break;
                case heroQualitySort.C:
                    def = this.properties.initialDef + this.level * 0.5;
                    break;
                case heroQualitySort.S:
                    def = this.properties.initialDef + this.level * 0.8;
                    break;
            }
            this.equipments.forEach(function (equipment) { return def += equipment.Def; });
            return def;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Hero.prototype, "fightPower", {
        // @Cache
        get: function () {
            var result = this.Atk * 1.2 + this.Def * 0.8; //攻击防御已经计算到hero中了
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Hero.prototype.setinformation = function (id, name, atk, def, quality, bitmap) {
        var _this = this;
        this.properties.setInformation(id, this.tempid, name, atk, def, bitmap);
        this.quality = quality;
        this.properties._bitmap.touchEnable = true;
        var heroStatusBar = new HeroStatusBar();
        this.properties._bitmap.addEventListener(engine.MyTouchEvent.TouchClick, function () {
            heroStatusBar.setInformation(_this);
            heroStatusBar.x = 100;
            heroStatusBar.y = 100;
            GameManager.getInstance().UIManager.addLayer(LayerType.UILayer, heroStatusBar);
            //console.log("点击人物");
            //this.addChild(heroBar);
            //this.swapChildren(heroBar,this._bitmap);
        });
    };
    Hero.prototype.addEquipment = function (user, equipment) {
        if (this.equipmentCurrent < Hero.equipmentLimit) {
            this.equipments.push(equipment);
            user.flag = true;
            this.flag = true;
            this.equipmentCurrent++;
        }
        else {
            console.error("装备超过上限");
        }
    };
    Hero.prototype.removeEquipment = function (user, equipment) {
        if (this.equipmentCurrent <= 0)
            console.error("没有装备可以卸载");
        else {
            var index = this.equipments.indexOf(equipment);
            this.equipments.splice(index);
            user.flag = true;
            this.flag = true;
        }
    };
    return Hero;
}(engine.DisplayObjectContainer));
Hero.Id = 0;
Hero.equipmentLimit = 5;
var _this = this;
var Check = function (target, propertyName, desc) {
    console.log(target);
    console.log(propertyName);
    console.log(desc);
    var getter = desc.value;
    console.log("desc.get" + desc.get);
    console.log("desc.set" + desc.set);
    return getter.apply(_this);
    //return target["inToTeam(hero: Hero)"];
    //return desc;
};
var User = (function () {
    function User() {
        this.level = 0;
        this.gold = 0;
        this._cacheFightPower = 0;
        this.flag = false;
        User.count++;
        if (User.count > 1)
            throw 'singleton!!';
        this.container = new engine.DisplayObjectContainer();
        this.role = new Role();
        this.id = "";
        this.exp = new Bignumber();
        this.cash = new Bignumber();
        this.heros = [];
        this.container.addChild(this.role);
    }
    User.getInstance = function () {
        if (this.instance == null)
            this.instance = new User();
        return this.instance;
    };
    Object.defineProperty(User.prototype, "heroesInTeam", {
        get: function () {
            return this.heros.filter(function (hero) { return hero.isInTeam; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(User.prototype, "fightPower", {
        // @Cache
        get: function () {
            var result = 0;
            this.heroesInTeam.forEach(function (hero) { return result += hero.fightPower; });
            this._cacheFightPower = result;
            this.flag = false;
            return this._cacheFightPower;
        },
        enumerable: true,
        configurable: true
    });
    User.prototype.setinformation = function (id, idlelist, walklist) {
        this.id = id;
        this.role.x = 0;
        this.role.y = 200;
        this.role.scaleX = 0.8;
        this.role.scaleY = 0.8;
        //this.addChild(this.role);
        this.role.call(idlelist, walklist);
        //console.log(this.role._role.texture);
        this.tapRole();
    };
    User.prototype.tapRole = function () {
        var _this = this;
        var heroBar = new HeroBar();
        this.role._role.touchEnable = true;
        this.role._role.addEventListener(engine.MyTouchEvent.TouchClick, function () {
            heroBar.setInformation(_this);
            //this.container.addChild(heroBar);
            GameManager.getInstance().UIManager.addLayer(LayerType.UILayer, heroBar);
        });
    };
    User.prototype.addHero = function (hero) {
        this.heros.push(hero);
    };
    //@Check
    User.prototype.inToTeam = function (hero) {
        if (this.checkHero(hero)) {
            var i = this.heros.indexOf(hero);
            this.heros[i].isInTeam == true;
            if (this.heros[i].isInTeam == true) {
                console.warn(hero.properties.name + "已经上阵");
                return;
            }
            else {
                this.heros[i].isInTeam = true;
            }
            this.flag = true;
        }
    };
    //@Check
    User.prototype.checkHero = function (hero) {
        if (this.heros.filter(function (temphero) { return (temphero.properties.configId == hero.properties.configId) && (temphero.properties.identityID == hero.properties.identityID); })) {
            return true;
        }
        return false;
    };
    User.prototype.outToTean = function (hero) {
        if (this.checkHero(hero)) {
            if (hero.isInTeam == false) {
                console.warn(hero.properties.name + "没有上阵");
                return;
            }
            else {
                hero.isInTeam = false;
            }
            this.flag = true;
        }
    };
    return User;
}());
User.heroesInTeamLimit = 5;
User.idlelist = ["/Game/assets/Idle0.png", "/Game/assets/Idle1.png", "/Game/assets/Idle2.png", "/Game/assets/Idle3.png"];
User.walklist = ["/Game/assets/10000.png", "/Game/assets/10001.png", "/Game/assets/10002.png", "/Game/assets/10003.png", "/Game/assets/10004.png", "/Game/assets/10005.png", "/Game/assets/10006.png", "/Game/assets/10007.png"];
User.count = 0;
var Equipment = (function (_super) {
    __extends(Equipment, _super);
    function Equipment() {
        var _this = _super.call(this) || this;
        _this.crystalsCurrent = 0;
        _this.tempid = 0;
        _this.crystals = [];
        Equipment.Id++;
        _this.tempid = Equipment.Id;
        _this.properties = new Property();
        GameManager.getInstance().UIManager.addLayer(LayerType.UILayer, _this.properties._bitmap);
        return _this;
        // this.addChild(this.properties._bitmap);
    }
    Equipment.prototype.getClassName = function () {
        return "Equipment";
    };
    Equipment.prototype.getQualityDescript = function () {
        return equipmentQualitySort[this.quality];
    };
    Object.defineProperty(Equipment.prototype, "Atk", {
        get: function () {
            var result = 0;
            this.crystals.forEach(function (crystal) { return result += crystal.Atk; });
            switch (this.quality) {
                case equipmentQualitySort.Common:
                    result = result * 0.8;
                    break;
                case equipmentQualitySort.Rare:
                    result = result * 0.9;
                    break;
                case equipmentQualitySort.Epic:
                    result = result * 1.0;
                    break;
                case equipmentQualitySort.Story:
                    result = result * 1.2;
                    break;
            }
            result += this.properties.initialAtk;
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Equipment.prototype, "Def", {
        get: function () {
            var result = 0;
            this.crystals.forEach(function (crystal) { return result += crystal.Def; });
            switch (this.quality) {
                case equipmentQualitySort.Common:
                    result = result * 0.8;
                    break;
                case equipmentQualitySort.Rare:
                    result = result * 0.9;
                    break;
                case equipmentQualitySort.Epic:
                    result = result * 1.0;
                    break;
                case equipmentQualitySort.Story:
                    result = result * 1.2;
                    break;
            }
            result += this.properties.initialDef;
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Equipment.prototype, "fightPower", {
        // private _cacheEquipmentFightPower = 0;
        get: function () {
            var result = this.Atk * 1.2 + this.Def * 0.8;
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Equipment.prototype.setinformation = function (id, atk, def, name, quality, bitmap) {
        this.properties.setInformation(id, this.tempid, name, atk, def, bitmap);
        this.quality = quality;
    };
    Equipment.prototype.addCrystal = function (user, crystal) {
        if (this.crystalsCurrent > Equipment.crystalsLimit)
            console.error("宝石超过上限，不能镶嵌");
        else {
            this.crystals.push(crystal);
            user.flag = true;
            this.crystalsCurrent++;
        }
    };
    Equipment.prototype.removeCrystal = function (user, crystal) {
        if (this.crystalsCurrent < 0)
            console.error(this.properties.name + "没有宝石，不能卸载");
        else {
            var index = this.crystals.indexOf(crystal);
            this.crystals.splice(index);
            user.flag = true;
            this.crystalsCurrent--;
        }
    };
    return Equipment;
}(engine.DisplayObjectContainer));
Equipment.Id = 0;
Equipment.crystalsLimit = 5;
var Crystal = (function (_super) {
    __extends(Crystal, _super);
    function Crystal() {
        var _this = _super.call(this) || this;
        _this.tempid = 0;
        Crystal.Id++;
        _this.tempid = Crystal.Id;
        _this.properties = new Property();
        GameManager.getInstance().UIManager.addLayer(LayerType.UILayer, _this.properties._bitmap);
        return _this;
        //this.addChild(this.properties._bitmap);
    }
    Crystal.prototype.getClassName = function () {
        return "Crystal";
    };
    Crystal.prototype.getQualityDescript = function () {
        return crystalQualitySort[this.quality];
    };
    Object.defineProperty(Crystal.prototype, "Atk", {
        get: function () {
            return this.properties.initialAtk;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Crystal.prototype, "Def", {
        get: function () {
            return this.properties.initialDef;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Crystal.prototype, "fightPower", {
        get: function () {
            var result = this.properties.initialAtk * 1.2 + this.properties.initialDef * 0.8;
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Crystal.prototype.setinformation = function (id, atk, def, name, bitmap) {
        this.properties.setInformation(id, this.tempid, name, atk, def, bitmap);
    };
    return Crystal;
}(engine.DisplayObjectContainer));
Crystal.Id = 0;
var Details = (function (_super) {
    __extends(Details, _super);
    function Details() {
        var _this = _super.call(this) || this;
        _this.contentField = new engine.DisplayObjectContainer();
        return _this;
    }
    Details.prototype.setInformation = function (content) {
        var _this = this;
        var background = new engine.Bitmap();
        background.src = "/Game/assets/detailbg.png";
        background.scaleX = 1.2;
        background.scaleY = 1.3;
        background.y = 190;
        background.x = 220;
        //tool.anch(background);
        this.contentField.addChild(background);
        this.role = new engine.Bitmap();
        this.role = content.properties._bitmap;
        this.role.x = 150;
        this.role.y = 200;
        this.contentField.addChild(this.role);
        var quality = new engine.TextField();
        quality.text = "Quality:  " + content.getQualityDescript();
        quality.color = "0X000000";
        quality.x = 220;
        quality.y = 350;
        quality.scaleX = 0.7;
        quality.scaleY = 0.7;
        this.contentField.addChild(quality);
        var atk = new engine.TextField();
        atk.text = content.properties.atkDiscript + content.Atk.toString();
        atk.color = "0X000000";
        atk.x = 220;
        atk.y = 200;
        atk.scaleX = 0.7;
        atk.scaleY = 0.7;
        this.contentField.addChild(atk);
        var def = new engine.TextField();
        def.text = content.properties.defDiscript + content.Def.toString();
        def.color = "0X000000";
        def.x = 220;
        def.y = 250;
        def.scaleX = 0.7;
        def.scaleY = 0.7;
        this.contentField.addChild(def);
        var FightPower = new engine.TextField();
        FightPower.text = "FighrPower:   " + content.fightPower.toString();
        FightPower.color = "0X000000";
        FightPower.x = 220;
        FightPower.y = 300;
        FightPower.scaleX = 0.7;
        FightPower.scaleY = 0.7;
        this.contentField.addChild(FightPower);
        var returnButton = new engine.Bitmap();
        returnButton.src = "/Game/assets/return.png";
        tool.anch(returnButton);
        returnButton.x = 370;
        returnButton.y = 210;
        this.contentField.addChild(returnButton);
        //LayoutController.getIntance().addLayer(LayerType.DetailLayer, this.contentField);
        this.addChild(this.contentField);
        returnButton.touchEnable = true;
        returnButton.addEventListener(engine.MyTouchEvent.TouchClick, function () {
            _this.removeChild(_this.contentField);
        });
    };
    return Details;
}(engine.DisplayObjectContainer));
var HeroStatusBar = (function (_super) {
    __extends(HeroStatusBar, _super);
    function HeroStatusBar() {
        var _this = _super.call(this) || this;
        _this.gridX = 90;
        _this.gridY = 60;
        _this.gridOffset = 10;
        _this.container = new engine.DisplayObjectContainer();
        //this.addChild(this.container);
        _this.background = new engine.Bitmap();
        _this.scaleX = 1.2;
        _this.scaleY = 1.2;
        _this.container.addChild(_this.background);
        _this.role = new engine.Bitmap();
        _this.role.x = 30;
        _this.role.y = 30;
        _this.role.scaleX = 0.7;
        _this.role.scaleY = 0.7;
        _this.container.addChild(_this.role);
        _this.barname = new engine.TextField();
        _this.barname.color = "0X000000";
        _this.barname.y = 240;
        _this.barname.x = 50;
        _this.container.addChild(_this.barname);
        _this.equipmentField = new engine.DisplayObjectContainer();
        _this.initEquipmentField();
        _this.equipmentField.x = 50;
        _this.equipmentField.y = 20;
        _this.container.addChild(_this.equipmentField);
        _this.propertyField = new engine.DisplayObjectContainer();
        _this.propertyField.x = 120;
        _this.propertyField.y = 120;
        _this.container.addChild(_this.propertyField);
        var returnButton = new engine.Bitmap();
        returnButton.src = "/Game/assets/return.png";
        tool.anch(returnButton);
        returnButton.x = 370;
        returnButton.y = 210;
        _this.container.addChild(returnButton);
        returnButton.touchEnable = true;
        returnButton.addEventListener(engine.MyTouchEvent.TouchClick, function () {
            _this.removeChild(_this.container);
        });
        return _this;
    }
    HeroStatusBar.prototype.initPropertyField = function (hero) {
        var level = new engine.TextField();
        level.text = "Level:  " + hero.level.toString();
        level.color = "0X000000";
        level.scaleX = 0.7;
        level.scaleY = 0.7;
        this.propertyField.addChild(level);
        var quality = new engine.TextField();
        quality.text = "Quality:  " + heroQualitySort[hero.quality];
        quality.color = "0X000000";
        quality.x = 110;
        quality.scaleX = 0.7;
        quality.scaleY = 0.7;
        this.propertyField.addChild(quality);
        var atk = new engine.TextField();
        atk.text = hero.properties.atkDiscript + hero.Atk.toString();
        atk.color = "0X000000";
        atk.y = 50;
        atk.scaleX = 0.7;
        atk.scaleY = 0.7;
        this.propertyField.addChild(atk);
        var def = new engine.TextField();
        def.text = hero.properties.defDiscript + hero.Def.toString();
        def.color = "0X000000";
        def.x = 110;
        def.y = 50;
        def.scaleX = 0.7;
        def.scaleY = 0.7;
        this.propertyField.addChild(def);
        var FightPower = new engine.TextField();
        FightPower.text = "FighrPower:   " + hero.fightPower.toString();
        FightPower.color = "0X000000";
        FightPower.y = 100;
        FightPower.scaleX = 0.7;
        FightPower.scaleY = 0.7;
        this.propertyField.addChild(FightPower);
    };
    HeroStatusBar.prototype.initEquipmentField = function () {
        this.grids = [];
        for (var i = 0; i < Hero.equipmentLimit; i++) {
            var grid = new ObjectGrid();
            this.grids.push(grid);
        }
        this.grids[0].x = this.gridX;
        this.grids[0].y = this.gridY;
        this.equipmentField.addChild(this.grids[0]);
        for (var i = 1; i < Hero.equipmentLimit; i++) {
            this.grids[i].x = this.grids[i - 1].x + this.grids[i].border.img.width + this.gridOffset;
            this.grids[i].y = this.gridY;
            this.equipmentField.addChild(this.grids[i]);
        }
    };
    HeroStatusBar.prototype.setInformation = function (hero) {
        this.background.src = "/Game/assets/bg.png";
        this.role.img = hero.properties._bitmap.img;
        tool.anch(this.role);
        this.role.x = 90;
        this.role.y = 160;
        this.barname.text = hero.properties.name;
        this.initPropertyField(hero);
        for (var i = 0; i < hero.equipmentCurrent; i++) {
            this.grids[i].call(hero.equipments[i]);
        }
        for (var i = 0; i < hero.equipmentCurrent; i++) {
            this.grids[i].Tap();
        }
        this.addChild(this.container);
    };
    return HeroStatusBar;
}(engine.DisplayObjectContainer));
var ObjectGrid = (function (_super) {
    __extends(ObjectGrid, _super);
    function ObjectGrid() {
        var _this = _super.call(this) || this;
        _this.border = new engine.Bitmap();
        _this.addChild(_this.border);
        _this.contentBitmap = new engine.Bitmap();
        _this.addChild(_this.contentBitmap);
        _this.border.src = "/Game/assets/Border.png";
        tool.anch(_this.border);
        return _this;
    }
    ObjectGrid.prototype.call = function (content) {
        this.content = content;
        this.contentBitmap.img = content.properties._bitmap.texture;
        tool.anch(this.contentBitmap);
        var scale = this.border.img.width / this.contentBitmap.img.width;
        this.contentBitmap.scaleX = scale;
        this.contentBitmap.scaleY = scale;
        //console.log(scale);
    };
    ObjectGrid.prototype.Tap = function () {
        var _this = this;
        var details = new Details();
        this.contentBitmap.touchEnable = true;
        this.contentBitmap.addEventListener(engine.MyTouchEvent.TouchClick, function () {
            details.setInformation(_this.content);
            //this.addChild(details);
            GameManager.getInstance().UIManager.addLayer(LayerType.DetailLayer, details);
            //this.swapChildren(details,content.parent)
            //console.log("123456789123446587");
        });
    };
    return ObjectGrid;
}(engine.DisplayObjectContainer));
var Property = (function () {
    function Property() {
        this.identityID = 0;
        this.initialAtk = 0;
        this.initialDef = 0;
        this._bitmap = new engine.Bitmap();
        this._bitmap = new engine.Bitmap();
        this._bitmap.scaleX = 1.5;
        this._bitmap.scaleY = 1.5;
        this._bitmap.x = 0;
        this._bitmap.y = 0;
    }
    Object.defineProperty(Property.prototype, "atkDiscript", {
        get: function () {
            return "ATK:   ";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Property.prototype, "defDiscript", {
        get: function () {
            return "DEF:   ";
        },
        enumerable: true,
        configurable: true
    });
    Property.prototype.setInformation = function (configId, identityID, name, initialAtk, initialDef, _bitmap) {
        this.configId = configId;
        this.identityID = identityID;
        this.name = name;
        this.initialAtk = initialAtk;
        this.initialDef = initialDef;
        this._bitmap.img = _bitmap.img;
        tool.anch(this._bitmap);
    };
    return Property;
}());
var tool = (function () {
    function tool() {
    }
    tool.anch = function (bitmap) {
        // bitmap.anchorOffsetX = bitmap.width / 2;
        // bitmap.anchorOffsetY = bitmap.height / 2;
    };
    return tool;
}());
var equipmentQualitySort;
(function (equipmentQualitySort) {
    equipmentQualitySort[equipmentQualitySort["Common"] = 0] = "Common";
    equipmentQualitySort[equipmentQualitySort["Rare"] = 1] = "Rare";
    equipmentQualitySort[equipmentQualitySort["Epic"] = 2] = "Epic";
    equipmentQualitySort[equipmentQualitySort["Story"] = 3] = "Story"; //传说
})(equipmentQualitySort || (equipmentQualitySort = {}));
var heroQualitySort;
(function (heroQualitySort) {
    heroQualitySort[heroQualitySort["C"] = 0] = "C";
    heroQualitySort[heroQualitySort["B"] = 1] = "B";
    heroQualitySort[heroQualitySort["A"] = 2] = "A";
    heroQualitySort[heroQualitySort["S"] = 3] = "S"; //传说
})(heroQualitySort || (heroQualitySort = {}));
var crystalQualitySort;
(function (crystalQualitySort) {
    crystalQualitySort[crystalQualitySort["diamond"] = 0] = "diamond";
    crystalQualitySort[crystalQualitySort["ellipse"] = 1] = "ellipse";
    crystalQualitySort[crystalQualitySort["circle"] = 2] = "circle";
    crystalQualitySort[crystalQualitySort["jewel"] = 3] = "jewel"; //钻石型
})(crystalQualitySort || (crystalQualitySort = {}));
var HeroBar = (function (_super) {
    __extends(HeroBar, _super);
    function HeroBar() {
        var _this = _super.call(this) || this;
        _this.gridX = 90;
        _this.gridY = 120;
        _this.gridOffset = 20;
        _this.container = new engine.DisplayObjectContainer();
        //this.addChild(this.container);
        _this.background = new engine.Bitmap();
        _this.scaleX = 1.2;
        _this.scaleY = 1.2;
        _this.container.addChild(_this.background);
        var returnButton = new engine.Bitmap();
        returnButton.src = "/Game/assets/return.png";
        tool.anch(returnButton);
        returnButton.x = 370;
        returnButton.y = 210;
        _this.container.addChild(returnButton);
        returnButton.touchEnable = true;
        returnButton.addEventListener(engine.MyTouchEvent.TouchClick, function () {
            _this.removeChild(_this.container);
        });
        _this.inithero();
        return _this;
    }
    HeroBar.prototype.inithero = function () {
        this.grids = [];
        for (var i = 0; i < User.heroesInTeamLimit; i++) {
            var grid = new HeroGrid();
            this.grids.push(grid);
        }
        this.grids[0].x = this.gridX;
        this.grids[0].y = this.gridY;
        this.grids[0].scaleY = 1.8;
        this.grids[0].scaleX = 1.2;
        this.container.addChild(this.grids[0]);
        for (var i = 1; i < User.heroesInTeamLimit; i++) {
            this.grids[i].scaleY = 1.8;
            this.grids[i].scaleX = 1.2;
            this.grids[i].x = this.grids[i - 1].x + this.grids[i].border.img.width + this.gridOffset;
            this.grids[i].y = this.gridY;
            this.container.addChild(this.grids[i]);
        }
    };
    HeroBar.prototype.setInformation = function (user) {
        this.background.src = "/Game/assets/bg.png";
        for (var i = 0; i < User.heroesInTeamLimit; i++) {
            this.grids[i].call(user.heroesInTeam[i]);
        }
        for (var i = 0; i < User.heroesInTeamLimit; i++) {
            this.grids[i].Tap(user.heroesInTeam[i]);
        }
        this.addChild(this.container);
    };
    return HeroBar;
}(engine.DisplayObjectContainer));
var HeroGrid = (function (_super) {
    __extends(HeroGrid, _super);
    function HeroGrid() {
        var _this = _super.call(this) || this;
        _this.border = new engine.Bitmap();
        _this.addChild(_this.border);
        _this.contentBitmap = new engine.Bitmap();
        _this.addChild(_this.contentBitmap);
        _this.border.src = "/Game/assets/Border.png";
        tool.anch(_this.border);
        return _this;
    }
    HeroGrid.prototype.call = function (content) {
        if (content == null) {
            return;
        }
        this.content = content;
        this.contentBitmap.img = content.properties._bitmap.texture;
        tool.anch(this.contentBitmap);
        var scale = this.border.img.width / this.contentBitmap.img.width;
        this.contentBitmap.scaleX = scale;
        this.contentBitmap.scaleY = scale;
        this.border.src = "/Game/assets/null.png";
    };
    HeroGrid.prototype.Tap = function (hero) {
        var heroStatusBar = new HeroStatusBar();
        this.contentBitmap.touchEnable = true;
        this.contentBitmap.addEventListener(engine.MyTouchEvent.TouchClick, function () {
            heroStatusBar.setInformation(hero);
            GameManager.getInstance().UIManager.addLayer(LayerType.UILayer, heroStatusBar);
        });
    };
    return HeroGrid;
}(engine.DisplayObjectContainer));
var Monster = (function (_super) {
    __extends(Monster, _super);
    function Monster() {
        var _this = _super.call(this) || this;
        _this.hp = 0;
        _this.hpLImit = 0;
        _this.alive = true;
        _this.tempid = 0;
        _this.properties = new Property();
        Monster.Id++;
        _this.tempid = Monster.Id;
        _this.addChild(_this.properties._bitmap);
        return _this;
    }
    Monster.prototype.call = function (id, name, atk, def, bitmap, hp) {
        this.properties.setInformation(id, this.tempid, name, atk, def, bitmap);
        this.hp = hp;
        this.hpLImit = hp;
        this.tap();
    };
    Monster.prototype.tap = function () {
        var _this = this;
        this.properties._bitmap.touchEnable = true;
        this.properties._bitmap.addEventListener(engine.MyTouchEvent.TouchClick, function () {
            var list = new CommandList();
            var walk = new WalkCommand(_this.x - GameScene.mapOffsetX, _this.y);
            var fight = new FightCommand();
            list.addCommand(walk);
            list.addCommand(fight);
            list.execute();
            _this.hp -= 50;
            _this.checkAlive();
            console.log("战斗");
        });
    };
    Monster.prototype.checkAlive = function () {
        if (this.hp <= this.hpLImit) {
            this.alive = false;
            this.properties._bitmap.touchEnable = false;
            GameManager.getInstance().secneManager.currentScene.notify(this.properties.configId);
        }
        else {
            this.alive = true;
        }
    };
    return Monster;
}(engine.DisplayObjectContainer));
Monster.Id = 0;
//# sourceMappingURL=Game.js.map