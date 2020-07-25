import { createGrid, nextGen, setExample, } from '../life2d'
import { gameExamples } from '../2d/examples'
import { Tilemaps } from 'phaser';
import { CellImage } from './CellImage';
import { ICell, settings,IGrid, IGridCell } from '../life';

export class MainScene extends Phaser.Scene {
    constructor() {
        super('main');
    }
    preload() {
        this.load.setBaseURL('http://labs.phaser.io');
        this.load.image('sky', 'assets/skies/space3.png');
        this.load.image('red', 'assets/particles/red.png');

    }
    grid: IGridCell
    size = 25
    imgScale = 0
    onImgScale = 0.8;
    images: CellImage[][] = []
    updateTime = 100;
    onClr = 0xff0000;
    offClr = 0x0000ff;
    create() {
        console.log('starting')
        settings.size = 40;
        this.grid = createGrid();
        setExample(this.grid, 'Glider Gun');
        settings.hasBoundary = true;
        let padding = 50;
        // this.add.image(0, 0, 'sky')
        //     .setOrigin(0,0)
        //     .setSize(this.scale.width, this.scale.height);
        for(let i = 0;i < this.grid.width;i++){
            let imagesRow: CellImage[] = []
            for(let j = 0;j< this.grid.height;j++){
                let current = this.grid.get(i,j,0);

                let img = this.add.image(padding + i*this.size,padding + j*this.size,'red').setScale(this.imgScale)
                
                let cell = new CellImage()
                cell.image = img;
                cell.scene = this;
                cell.delay = this.updateTime

                if(current.value == 1){
                    imagesRow.push(cell);
                    cell.setState(true);
                }
                else{
                    imagesRow.push(cell);
                    cell.setState(false);
                }
            }

            this.images.push(imagesRow);
        }
        this.time.addEvent({repeat: -1, delay: this.updateTime, callbackScope: this, callback: () => {
            nextGen(this.grid)
            this.updateGrid()
        }})
    }

    updateGrid(){
        for(let i = 0;i < this.grid.width;i++){
            for(let j = 0;j< this.grid.height;j++){
                let current = this.grid.get(i,j,0);

                let currentImg = this.images[i][j];
                if(current.previousValue == current.value){
                    continue;
                }
                
                if(current.value == 1){
                   currentImg.setState(true)
                }
                else{
                    currentImg.setState(false)
                }
            }
        }
    }
}
