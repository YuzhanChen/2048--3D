import { moveX, moveZ, moveY, genBezier3, genBezier2 } from './Animations.js'

var GameActions = function (grid, scene, cubes) {
    this.grid = grid;
    this.gridRows = grid.length;
    this.gridCols = grid[0].length;
    this.scene = scene;
    this.cubes = cubes;
    this.config = {
        step: 5,
        baseX: -1.5 * 5,
        baseZ: -1.5 * 5,
        baseY: 6,
        speed: 300,
        benzier: genBezier3(0, 0, 0.5, 0, 0.5, 1, 1, 1, 50).y,
        benzier2: genBezier2(0, 0, 1, 0, 1, 1, 50).y,
        winWeight: 6,
    };
    this.isWin = false;
    this.isFail = false;
    this.addCube = function (i, j, weight = 0) {
        var mesh = cubes[weight].clone();
        this.grid[i][j] = {
            weight: weight,
            mesh: mesh
        }
        mesh.position.set(
            this.config.baseX + j * this.config.step,
            this.config.baseY + 2*this.config.step,
            this.config.baseZ + i * this.config.step
        );
        scene.add(mesh);
        var move = new moveY(
            this.config.baseY + 2*this.config.step, 
            this.config.baseY, 
            this.config.speed, 
            mesh, 
            this.config.benzier2
        );
        move.start();
    }
    this.removeCube = function(i,j){
        if(this.grid[i][j]!==null){
            var mesh = this.grid[i][j].mesh;
            this.grid[i][j] = null;
            var move = new moveY(
                this.config.baseY, 
                this.config.baseY + 2*this.config.step, 
                this.config.speed, 
                mesh, 
                this.config.benzier2
            );
            move.start();
            setTimeout((mesh)=>{scene.remove(mesh)},this.config.speed, mesh);
        }
    }
    this.elimCube = function(i,j){
        this.scene.remove(this.grid[i][j].mesh);
        this.grid[i][j] = null;
    }
    this.createCube = function(i,j, weight = 0){
        var mesh = cubes[weight].clone();
        this.grid[i][j] = {
            weight: weight,
            mesh: mesh
        }
        mesh.position.set(
            this.config.baseX + j * this.config.step,
            this.config.baseY,
            this.config.baseZ + i * this.config.step
        );
        scene.add(mesh);
    }
    this.randomPop = function(){
        var i = Math.floor(Math.random()*this.gridRows);
        var j = Math.floor(Math.random()*this.gridCols);
        var cnt = 0;
        while(this.grid[i][j] !== null && cnt<50){
            var i = Math.floor(Math.random()*this.gridRows);
            var j = Math.floor(Math.random()*this.gridCols);    
            cnt++;        
        }
        if(cnt<50){
            this.addCube(i,j,0);
        }
    }
    this.restart = function(){
        for(var i=0;i<this.gridRows;i++){
            for(var j=0;j<this.gridCols;j++){
                if(grid[i][j]!=null){
                    this.elimCube(i,j);
                }
            }
        }
    }
    this.slideDown = function(){
        for(var j=0;j<this.gridCols;j++){
            var pos = this.gridRows-1;
            var mergeWight;
            for(var i=this.gridRows-1;i>=0;i--){
                if(this.grid[i][j]!==null){
                    mergeWight = -1;
                    for(var ii=i-1;ii>=0;ii--){
                        if(this.grid[ii][j]!==null){
                            if(this.grid[ii][j].weight === this.grid[i][j].weight)
                                mergeWight = this.grid[ii][j].weight;
                            break;
                        }
                    }
                    if(mergeWight >= 0 ){
                        this.elimCube(i,j);
                        this.elimCube(ii,j);
                        this.createCube(i,j,mergeWight+1);
                    }
                    if(pos!==i){                        
                        var move = new moveZ(
                            this.config.baseZ + i * this.config.step,
                            this.config.baseZ + pos * this.config.step,
                            this.config.speed,
                            this.grid[i][j].mesh,
                            this.config.benzier
                        );
                        move.start();
                        this.grid[pos][j] = this.grid[i][j];
                        this.grid[i][j] = null;                      
                    }
                    pos--;
                }
            }
        }
    }
    this.slideRight = function(){
        for(var i=0;i<this.gridRows;i++){
            var pos = this.gridCols-1;
            var mergeWight;
            for(var j=this.gridCols-1;j>=0;j--){
                if(this.grid[i][j]!==null){
                    mergeWight = -1;
                    for(var jj=j-1;jj>=0;jj--){
                        if(this.grid[i][jj]!==null ){
                            if(this.grid[i][jj].weight === this.grid[i][j].weight)
                                mergeWight = this.grid[i][jj].weight;
                            break;
                        }
                    }
                    if(mergeWight >= 0 ){
                        this.elimCube(i,j);
                        this.elimCube(i,jj);
                        this.createCube(i,j,mergeWight+1);
                    }
                    if(pos!==j){                        
                        var move = new moveX(
                            this.config.baseX + j * this.config.step,
                            this.config.baseX + pos * this.config.step,
                            this.config.speed,
                            this.grid[i][j].mesh,
                            this.config.benzier
                        );
                        move.start();
                        this.grid[i][pos] = this.grid[i][j];
                        this.grid[i][j] = null;                      
                    }
                    pos--;
                }
            }
        }
    }
    this.slideUp = function(){
        for(var j=0;j<this.gridCols;j++){
            var pos = 0;
            var mergeWight;
            for(var i=0;i<this.gridRows;i++){
                if(this.grid[i][j]!==null){
                    mergeWight = -1;
                    for(var ii=i+1;ii<this.gridRows;ii++){
                        if(this.grid[ii][j]!==null){
                            if(this.grid[ii][j].weight === this.grid[i][j].weight)
                                mergeWight = this.grid[ii][j].weight;
                            break;
                        }
                    }
                    if(mergeWight >= 0 ){
                        this.elimCube(i,j);
                        this.elimCube(ii,j);
                        this.createCube(i,j,mergeWight+1);
                    }
                    if(pos!==i){                        
                        var move = new moveZ(
                            this.config.baseZ + i * this.config.step,
                            this.config.baseZ + pos * this.config.step,
                            this.config.speed,
                            this.grid[i][j].mesh,
                            this.config.benzier
                        );
                        move.start();
                        this.grid[pos][j] = this.grid[i][j];
                        this.grid[i][j] = null;                      
                    }
                    pos++;
                }
            }
        }
    }
    this.slideLeft = function(){
        for(var i=0;i<this.gridRows;i++){
            var pos = 0;
            var mergeWight;
            for(var j=0;j<this.gridCols;j++){
                if(this.grid[i][j]!==null){
                    mergeWight = -1;
                    for(var jj=j+1;jj<this.gridCols;jj++){
                        if(this.grid[i][jj]!==null){
                            if(this.grid[i][jj].weight === this.grid[i][j].weight)
                                mergeWight = this.grid[i][jj].weight;
                            break;
                        }
                    }
                    if(mergeWight >= 0 ){
                        this.elimCube(i,j);
                        this.elimCube(i,jj);
                        this.createCube(i,j,mergeWight+1);
                    }
                    if(pos!==j){                        
                        var move = new moveX(
                            this.config.baseX + j * this.config.step,
                            this.config.baseX + pos * this.config.step,
                            this.config.speed,
                            this.grid[i][j].mesh,
                            this.config.benzier
                        );
                        move.start();
                        this.grid[i][pos] = this.grid[i][j];
                        this.grid[i][j] = null;                      
                    }
                    pos++;
                }
            }
        }
    }
}

export {
    GameActions
}