window.onload = () => {

    var canvas = document.getElementById("context") as HTMLCanvasElement;
    var stage = engine.run(canvas);

    //生成任务条件 
    function creatTaskCondition(type: string, target: string) {
        var taskCondition = null;
        if (type == "NPCTalkTaskCondition")
            taskCondition = new NPCTalkTaskCondition();
        if (type == "KillMonsterTaskCondition")
            taskCondition = new KillMonsterTaskCondition(target);
        return taskCondition;
    }

    //生成任务
    function creatTask(id: string): Task {
        var taskCondition = null;
        taskCondition = creatTaskCondition(Task.Task_LIST[id].TaskCondition.type, Task.Task_LIST[id].TaskCondition.target);
        var task = new Task(id,
            Task.Task_LIST[id].name,
            Task.Task_LIST[id].dris,
            Task.Task_LIST[id].fromNPCid,
            Task.Task_LIST[id].toNPCid,
            Task.Task_LIST[id].TaskCondition.total,
            taskCondition,
            Task.Task_LIST[id].toid);
        return task;
    }


    /**
     * 创建游戏场景
     * Create a game scene
     */
    var user: User;
    var map: TileMap= new TileMap();
    var _container = new engine.DisplayObjectContainer();
    //this.gameManager = GameManager.getInstance();

    _container.addChild(map);
    map.Create();

    var gameScene = new GameScene(map);
    GameManager.getInstance().secneManager.addScene(gameScene);

    user = User.getInstance();
    //this._container.addChild(this.user.container)
    GameManager.getInstance().UIManager.addLayer(LayerType.UILayer, user.container)
    user.setinformation("982049377", User.idlelist, User.walklist)
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



    var taskService: TaskService = TaskService.getIntance();
    var task: Task = creatTask("001");
    var task2: Task = creatTask("002");

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
    NPC1.x = 500; NPC1.y = 400;
    NPC2.x = 900; NPC2.y = 900;

    var TaskPanelLogo: engine.Bitmap = new engine.Bitmap();
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
    TaskPanelLogo.addEventListener(engine.MyTouchEvent.TouchClick, () => {
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
    stage.addChild(TaskPanelLogo);//为了能移动
   function walkByTap() {
        function ss() { }
        map.touchEnable = true;
        map.addEventListener(engine.MyTouchEvent.TouchClick, (evt: engine.MyTouchEvent) => {
            var walkCommand = new WalkCommand(evt.stageX, evt.stageY);
            walkCommand.execute(ss);
            //console.log("x"+evt.stageX+"y"+evt.stageY);
        });
    }
}