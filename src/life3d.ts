import { log, ICell, settings, updateCell, IGrid, IGridCell } from './life'



export class Grid<T> implements IGrid<T> {
    constructor(grid: T[][][]){
        this.grid = grid;
    }
    convert<A>(con: (item: T) => A): IGrid<A> {
        let items: A[][][] = []

        this.grid.forEach(p => {
            let row: A[][] = []
            p.forEach(p => {
                let height: A[] = []
                p.forEach(p => {
                    height.push(con(p))
                })
                row.push(height)
            })
            items.push(row)
        })
        return new Grid(items);
    }
    loop(callback: (v: T) => void): void {
        loop(this.grid, callback);
    }
    get(x: number, y: number, z: number): T {
        return this.grid[x][y][z];
    }
    grid: T[][][]
    get width(){
        return this.grid.length
    }
    get height(){
        return this.grid[0].length
    }
    get depth(){
        return this.grid[0][0].length;
    }
    
}

export function create3DArray<T>(size: number, add: (i:number,j:number,z:number) => T){
    let grid: T[][][] = []
    for (let i = 0; i < size; i++) {
        let row: T[][] = []
        for (let j = 0; j < size; j++) {
            let depth: T[] = []
            for (let z = 0; z < size; z++) {
                depth.push(add(i,j,z));
            }
            row.push(depth);
        }
        grid.push(row);
    }
    return grid;
}

export function createGrid() {
    let grid = create3DArray(settings.size, (i,j,z) => { 
        return {value: 0, friends: 0, previousValue: -1, x: i, y: j, z: z} 
    });
    return new Grid(grid);
}




function getNeighbors(grid: IGridCell, x: number, y: number, z: number) {
    let n: ICell[] = []

    let width = grid.width;
    let height = grid.height;
    let depth = grid.depth;
    for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
            for (let d = z - 1; d <= z + 1; d++) {

                let xR = i;
                let yR = j;
                let zR = d;
                // Is it the same cell?
                if (i == x && j == y && d == z) {
                    continue;
                }
                if(d < 0) {
                    if(settings.hasBoundary){
                        continue;
                    }
                    else {
                        zR = depth - 1;
                    }
                }
                else if(d == depth){
                    if(settings.hasBoundary){
                        continue;
                    }
                    else {
                        zR = 0;
                    }
                }

                if (i < 0) {
                    if (settings.hasBoundary) {
                        continue;
                    }
                    else {
                        xR = width - 1;
                    }
                }
                else if (i == width) {
                    if (settings.hasBoundary) {
                        continue;
                    }
                    else {
                        xR = 0;
                    }
                }

                if (height == j) {
                    if (settings.hasBoundary) {
                        continue;
                    }
                    else {
                        yR = 0;
                    }
                }
                else if (j < 0) {
                    if (settings.hasBoundary) {
                        continue
                    }
                    else {
                        yR = height - 1;
                    }
                }
                //log(`${i},${j}`);
                n.push(grid.get(xR,yR,zR))
                log('called')
            }
        }
    }
    return n;
}

export function loop<T>(grid: T[][][], callback: (v: T) => void) {
    grid.forEach((p) => {
        p.forEach((j) => {
            j.forEach(v => {
                callback(v);
            })
        })
    })
}

export class Settings3D {
    stayAliveMin= 4
    stayAliveMax= 8
    becomeAliveMin= 4
    becomeAliveMax= 10

    change(setting: Settings3D){
        this.stayAliveMin = setting.stayAliveMin;
        this.stayAliveMax = setting.stayAliveMax;
        this.becomeAliveMin = setting.becomeAliveMin;
        this.becomeAliveMax = setting.becomeAliveMax;
    }
}

export let aggressive = new Settings3D();

export let regular = new Settings3D();
regular.becomeAliveMin = 4;
regular.becomeAliveMax = 4;
regular.stayAliveMin = 5;
regular.stayAliveMax = 6;


export let settings3d = regular;

export function nextGen(grid: IGridCell) {
    grid.loop((v) => {
        let n = getNeighbors(grid, v.x, v.y, v.z);
        let count = n.filter(p => p.value == 1).length;
        v.friends = count;
    })
    grid.loop((v) => {
        let msg = `${v.x},${v.y}: `;
        updateCell(
            v,
            msg,
            n => n >= settings3d.stayAliveMin && n <= settings3d.stayAliveMax, 
            n => n >= settings3d.becomeAliveMin && n <= settings3d.becomeAliveMax);
    })
}