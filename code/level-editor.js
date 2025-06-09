class LevelEditor {
    constructor(blockSize) {
        this.grid = grid = new Grid(canvasWidth, canvasHeight, blockSize);
        this.blockSize = blockSize;
        this.drawObject = {
            platform: {
                asset: window.assets.images.blockYellow,
                type: 'platform',
                symbol: 'p'
            },
            rock: {
                asset: window.assets.images.blockGrey,
                type: 'rock',
                symbol: 'r'
            },
            spike: {
                asset: window.assets.images.blockSpike,
                type: 'spike',
                symbol: 'x'
            },
            friendlySpike: {
                asset: window.assets.images.blockFriendlySpike,
                type: 'friendly-spike',
                symbol: 'f'
            },
            start: {
                asset: window.assets.images.blockBoy,
                type: 'start',
                symbol: 's'
            },
            goal: {
                asset: window.assets.images.goal,
                type: 'goal',
                symbol: 'g'
            }
        };

        this.objectsGrid = [];
        const width = Math.floor(canvasWidth / blockSize);
        const height = Math.floor(canvasHeight / blockSize);
        for (let y = 0; y < height; y++) {
            this.objectsGrid.push(Array(width).fill(undefined));
        }
        this.selectedDrawObject = this.drawObject.platform;
        this.selectedDrawObjectImgElement;
        this.levelEditorOptionsDraw();

        this.drawMode = true;
        this.mouseClicked = false;
        this.mouseIcon = new MouseIcon(30);
    }

    getObjectsGridX(x) {
        return Math.floor(x / this.blockSize);
    }

    getObjectsGridY(y) {
        return Math.floor(y / this.blockSize);
    }

    draw() {
        this.grid.draw();
        this.updateObjects();
        this.drawObjects();
        this.mouseIcon.drawPencil();
    }

    addObjectToGrid(mouseGridPosX, mouseGridPosY) {
        assets.sounds.popCreate.play();
        this.objectsGrid[this.getObjectsGridY(mouseGridPosY)][this.getObjectsGridX(mouseGridPosX)] = new LevelObject(mouseGridPosX, mouseGridPosY, this.blockSize, this.selectedDrawObject.asset.image, null, this.selectedDrawObject.type);
    }

    removeObjectFromGrid(mouseGridPosX, mouseGridPosY) {
        assets.sounds.popRemove.play();
        this.objectsGrid[this.getObjectsGridY(mouseGridPosY)][this.getObjectsGridX(mouseGridPosX)] = undefined;
    }

    updateObjects() {
        if (mouseIsPressed) {
            if (mouseX >= canvasWidth || mouseX < 0 || mouseY >= canvasHeight || mouseY < 0)
                return; // Don't do anything as outside the canvas bounds

            let mouseGridPosX = mouseX - (mouseX % this.blockSize);
            let mouseGridPosY = mouseY - (mouseY % this.blockSize);

            try {
                let gridObject = this.objectsGrid[this.getObjectsGridY(mouseGridPosY)][this.getObjectsGridX(mouseGridPosX)];
                if (!gridObject && this.mouseClicked === false) {
                    this.addObjectToGrid(mouseGridPosX, mouseGridPosY);
                    this.drawMode = true;
                    this.mouseClicked = true;
                } else if (gridObject && gridObject.type === this.selectedDrawObject.type && this.mouseClicked === false) {
                    this.removeObjectFromGrid(mouseGridPosX, mouseGridPosY);
                    this.drawMode = false;
                    this.mouseClicked = true;
                } else if (gridObject && gridObject.type !== this.selectedDrawObject.type && this.mouseClicked === false) {
                    this.addObjectToGrid(mouseGridPosX, mouseGridPosY);
                    this.drawMode = true;
                    this.mouseClicked = true;
                } else if (!gridObject && this.drawMode && this.mouseClicked) {
                    this.addObjectToGrid(mouseGridPosX, mouseGridPosY);
                } else if (gridObject && this.drawMode === false && this.mouseClicked) {
                    this.removeObjectFromGrid(mouseGridPosX, mouseGridPosY);
                }
            } catch (error) {
                console.error('Error updating objects grid:', error);
            }
        }
    }

    drawObjects() {
        for (const row of this.objectsGrid) {
            for (const column of row) {
                if (column) {
                    column.draw();
                }
            }
        }
    }

    setMouseClicked(isClicked) {
        this.mouseClicked = isClicked;
    }

    levelEditorOptionsDraw() {
        const keys = Object.keys(this.drawObject);
        for (const key of keys) {
            const obj = this.drawObject[key];
            let imgElement = createImg(obj.asset.source);
            imgElement.position(canvasWidth + 50, 10 + keys.indexOf(key) * 50);
            imgElement.size(this.blockSize, this.blockSize);

            imgElement.elt.addEventListener('click', (event) => {
                if (this.selectedDrawObject !== obj) {
                    assets.sounds.selectClick.play();
                    this.selectedDrawObject = obj;
                    this.selectedDrawObjectImgElement.attribute('src', this.selectedDrawObject.asset.source);
                }
            }, { passive: true });
        }

        let selectionContainer = createDiv();
        selectionContainer.html('');
        selectionContainer.position(canvasWidth + 50, 50 + keys.length * 50);
        selectionContainer.style('border', '2px solid red');
        selectionContainer.style('padding', '5px');
        selectionContainer.style('display', 'inline-block');

        // Add a label above the image
        let selectionLabel = createP('Selection');
        selectionLabel.position(canvasWidth + 50, 50 + keys.length * 50 - 30);
        selectionLabel.style('font-weight', 'bold');
        selectionLabel.style('color', '#FFFFFF');


        this.selectedDrawObjectImgElement = createImg(this.selectedDrawObject.asset.source);
        this.selectedDrawObjectImgElement.size(this.blockSize, this.blockSize);
        selectionContainer.child(this.selectedDrawObjectImgElement);

        let copyButton = createButton('Copy Level to Clipboard');
        copyButton.position(canvasWidth + 50, 200 + keys.length * 50);
        copyButton.mousePressed(() => {
            this.copyLevelToClipboard();
        });
    }

    exportLevel() {
        let levelData = '';
        for (let x = 0; x < this.objectsGrid.length; x++) {
            for (let y = 0; y < this.objectsGrid[x].length; y++) {
                let obj = this.objectsGrid[x][y];
                if (obj) {
                    levelData += obj.symbol;
                    levelData += ',';
                } else {
                    levelData += '-';
                    levelData += ',';
                }
            }
            levelData = levelData.slice(0, -1); // Remove the last comma
            levelData += '\n'; // New line for the next row
        }
        return levelData;
    }

    copyLevelToClipboard() {
        let levelData = this.exportLevel();
        window.focus();
        navigator.clipboard.writeText(levelData).then(() => {
            console.log('Level data copied to clipboard!');
        }).catch((error) => {
            console.error('Failed to copy level data:', error);
        });
    }
}