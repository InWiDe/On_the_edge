const readline = require('readline');
const fs = require('fs');

//Readline setup
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/**
 * Class representing a quest question as an object
 */
class Quest 
{
    /**
     * 
     * @param {String} text content of the question
     */
    constructor(text) 
    {
        /**
         * @type {String}
         */
        this.questText = text;
        /**
         * @type {Number} By default has value -1
         */
        this.nextDialogId = -1;
    }
}

/**
 * Class representing a dialog class, that contains dialog phrases and questions
 */
class Dialog 
{
    /**
     * 
     * @param {Number | object} data id, or entire object for Dialog class
     */
    constructor(data) 
    {
        if (typeof data === 'number')
        {
            this.id = data
            this.senderTextArr = []
            this.questionArr = []
        } else if (typeof data === 'object') 
        {
            this.id = data.id;
            this.senderTextArr = data.senderTextArr;
            this.questionArr = data.questionArr;
        } 
    }

    /**
     * Create new sentence in Dialog class
     * 
     * @param {String} text New dialog sentence
     */
    addSenderText (text) 
    {
        this.senderTextArr.push(text)
    }

    /**
     * Change existing dialog text
     * @param {String} newText new content of dialog
     * @param {Number} index array index of existing dialog sentence.
     */
    changeSenderText(newText, index) 
    {
        this.senderTextArr[index] = newText;
    }

    /**
     * Delete existing dialog text
     * @param {Number} index array index of existing dialog sentence.
     */
    deleteSenderText(index) 
    {
        this.senderTextArr.splice(index, 1);
    }

    /**
     * Create new question in Dialog class
     * 
     * @param {Quest | object} questObj New question object
     */
    addQuestion (questObj) 
    {
        this.questionArr.push(questObj)
    }

    /**
     * Change existing dialog question
     * @param {Quest | object} questObj New question object of dialog
     * @param {Number} index array index of existing dialog question.
     */
    changeQuestion (questObj, index) 
    {
        this.questionArr[index] = questObj;
    }

    /**
     * Delete existing question in Dialog class
     * 
     * @param {Number} index array index of existing dialog question.
     */
    deleteQuestion (index) 
    {
        this.questionArr.splice(index, 1);
    }
}

/**
 * Class representing a story object, that contains 
 */
class Story 
{
    /**
     * Constructor contains of story array, that has orginized story object
     * Story object can be represented as:
     * {
     *  storyPath: 'any symbol',
     *  storyLine: [Dialog, Dialog, ...]
     * }
     */
    constructor () 
    {
        this._latestDialogId = 0;
        this.story = [];
    }

    /**
     * Function create new object in story array, that contains story path (unique symbol) and story line array,
     * that can contain Dialog objects
     * 
     * @returns {String} new path symbol
     */
    createStoryPath () 
    {
        let newPath = String.fromCharCode(this.story.length + 97)
        this.story.push({
            storyPath: newPath,
            storyLine: []
        });
        return newPath;
    }

    /**
     * Function delete selected path from story object
     * 
     * @param {String} storyPath path unique sybmol
     */
    deleteStoryPath (storyPath) 
    {
        let arrayIndex = storyPath.charCodeAt(0) - 97;
        this.story.splice(arrayIndex, 1);
        for (let i = arrayIndex; i < this.story.length; i++)
        {
            this.story[i].storyPath = String.fromCharCode(this.story[i].storyPath.charCodeAt(0) - 1);
        }
    }

    /**
     * Function create new Dialog object in unique story path
     * 
     * @param {String} storyPath path unique sybmol
     * @returns {Dialog} created dialog reference
     */
    createDialog (storyPath) 
    {
        let arrayIndex = storyPath.charCodeAt(0) - 97;
        let dialog = new Dialog(this._latestDialogId++);
        this.story[arrayIndex].storyLine.push(dialog)
        return dialog;
    }

    /**
     * Function delete existing dialog drom story path
     * 
     * @param {Number} dialogId Id of needed Dialog object
     * @param {String} storyPath path unique sybmol
     */
    deleteDialog (dialogId, storyPath) 
    {
        let arrayIndex = storyPath.charCodeAt(0) - 97;
        this.story[arrayIndex].storyLine.splice(dialogId, 1);
    }

    /**
     * Function give array reference of existing Dialog objects of unique story path
     * 
     * @param {String} userStoryPath path unique sybmol
     * @returns {Array<Dialog>} Array of existing Dialog objects in unique story path
     */
    getStoryLine(userStoryPath) 
    {
        let storyObj = this.story.find(storyObj => storyObj.storyPath === userStoryPath);
        return storyObj.storyLine;
    }

    /**
     * Function take saved instance of story array and recreate Dialog classes in it
     * 
     * @param {Array<{storyPath: String, storyLine: Array<object>}>} storyArr saved story array with non-classed objects in storyLine
     */
    recoverStoryLine(storyArr) 
    {
        this.story = storyArr;
        for (let i = 0; i < storyArr.length; i++) 
        {
            for (let j = 0; j < storyArr[i].storyLine.length; j++) 
            {
                this.story[i].storyLine[j] = new Dialog(storyArr[i].storyLine[j]);
            }
        }
        this._searchLatestDialogId();
    }

    /**
     * @returns {Array<String>} array of story path symbols
     */
    get paths () 
    {
        return this.story.map(storyObj => storyObj.storyPath);
    }

    /**
     * @returns {Number} Number of dialogs in all story paths
     */
    get storiesLength () 
    {
        let length = 0;
        this.story.forEach(storyObj => length += storyObj.storyLine.length);
        return length;
    }

    /**
     * Update latestDialogId variable by checking number of existing Dialog objects in story array
     * 
     * @private
     */
    _searchLatestDialogId() 
    {
        let latestId = 0;
        for (let i = 0; i < this.story.length; i++) 
        {
            let storyLineRef = this.story[i].storyLine;
            for(let j = 0; j < storyLineRef.length; j++) 
            {
                if (storyLineRef[j]?.id >= latestId)
                    latestId = storyLineRef[j].id
            }
        }
        latestId++;
        this._latestDialogId = latestId;
    }
}

class QuestEngine extends Story
{
    constructor() 
    {
        super();
    }

    startMenu () 
    {
        console.log(`\nThere is total ${this.storiesLength} dialogs currently`);
        console.log(`There is ${this.paths.length !== 0 ? '[' + this.paths + ']' : 0} paths currently\n`);
        this.choosePath();
    }

    saveStory() 
    {
        const storyObj = {story: this.story};
        const storyJSON = JSON.stringify(storyObj);
        fs.writeFile('./src/services/stories/story.json', storyJSON, err => 
        {
            if (err) 
            {
                console.error(err);
            }
        });
        rl.close();
    }

    readStory() 
    {
        let data = fs.readFileSync('./src/services/stories/story.json');
        if (data.length !== 0) 
        {
            data = JSON.parse(data);
            this.recoverStoryLine(data.story);
        }
        this.startMenu();
    }

    choosePath() 
    {
        rl.question(
        '- Enter path symbol to change it\n' +
        '- Or enter 1 to add new path\n' +
        '- Or enter 2 to save your story and close the engine\n' + 
        '- Or enter 3 to read data from existing file\n', answer => 
        {
            if (answer === '1') this.addNewPath();
            else if (answer === '2') this.saveStory();
            else if (answer === '3') this.readStory();
            else if (this.paths.find(path => path === answer)) this.changePath(answer);
            else
            {
                console.log('Invalid input');
                rl.close();
                this.choosePath();
            }
        });
    }

    addNewPath() 
    {
        let newPath = this.createStoryPath();
        console.log(`New path "${newPath}" was created successfully\n`);
        this.startMenu();
    }

    changePath (userPath) 
    {
        let storyLine = this.getStoryLine(userPath);
        let dialogIds = storyLine.map(dialog => dialog.id);
        console.log(`There is ${dialogIds.length !== 0 ? '[' + dialogIds + ']' : 'None'} dialogs ids in "${userPath}" story path.\n`);
        rl.question(
        '- Enter dialog id to change it \n- Or enter \'D\' to delete current path\n- Or enter \'C\' to create new dialog\n', answer => 
        {
            let dialog = storyLine.find(dialog => dialog.id === Number(answer));

            if (answer === 'D') this.deletePath(userPath);
            else if (answer === 'C') this.addNewDialog(userPath);
            else if (dialog) this.changeDialog(dialog);
            else 
            {
                console.log('Invalid input');
                this.startMenu();
            }
        });
    }

    deletePath(userPath) 
    {
        this.deleteStoryPath(userPath);
        console.log(`Path ${userPath} was successfully deleted`);
        this.startMenu();
    }

    addNewDialog(userPath) 
    {
        let dialog = this.createDialog(userPath);
        console.log(`New dialog with id ${dialog.id} was created successfully`);
        this.startMenu();
    }

    logDialogInformation(dialog) 
    {
        console.log(`Dialog id is: ${dialog.id}\nPlayer will recive this text:`);
        dialog.senderTextArr.forEach((str, index) => console.log(`${index+1}. ${str}`));
        console.log('Player will get this questions:');
        dialog.questionArr.forEach(({questText, nextDialogId}, index) => {
            console.log(`${index+1}. ${questText} (next dialog id ${nextDialogId !== -1 ? nextDialogId : '"Empty"'})`);
        });
        console.log();
    }

    changeDialog (dialog) 
    {
        this.logDialogInformation(dialog);
        rl.question(
            '- Enter "nd" to add new dialog sentence\n' +
            '- Enter "cd (sentence number)" to change dialog sentence\n' +
            '- Enter "dd (sentence number)" to delete dialog sentence\n' +
            '- Enter "nq" to add new question\n' +
            '- Enter "cq (question number)" to change question\n' +
            '- Enter "dq (question number)" to delete question\n'
            , answer => 
            {
                answer = answer.toLowerCase().split(' ');
                let index = Number(answer[1]) - 1;
                switch (answer[0])
                {
                    case "nd":
                        this.addNewDialogSentence(dialog);
                        break;
                    case "cd":
                        this.changeDialogSentence(dialog, index);
                        break;
                    case "dd":
                        this.deleteDialogSentence(dialog, index);
                        break;
                    case "nq":
                        this.addNewDialogQuestion(dialog);
                        break;
                    case "cq":
                        this.changeDialogQuestion(dialog, index);
                        break;
                    case "dq":
                        this.deleteDialogQuestion(dialog, index);
                        break;
                    default:
                        console.log('Invalid input');
                        this.startMenu();
                }
            });
    }

    addNewDialogSentence(dialog) 
    {
        rl.question(`Write your new dialog sentence\n`, answer => 
        {
            dialog.addSenderText(answer);
            console.log('New dialog sentence was added successfully');
            this.startMenu();
        })
    }

    changeDialogSentence(dialog, index) 
    {
        if (dialog.senderTextArr[index]) 
        {
            rl.question(`- Write your new dialog sentence\n`, answer => 
            {
                dialog.changeSenderText(answer, index);
                console.log('Dialog sentence was changed successfully');
                this.startMenu();
            })
        } else 
        {
            console.log('Invalid index');
            this.startMenu();
        }
    }

    deleteDialogSentence(dialog, index) 
    {
        if (dialog.senderTextArr[index]) 
        {
            dialog.deleteSenderText(index);
            console.log('Dialog sentence was deleted successfully');
            this.startMenu();
        } else 
        {
            console.log('Invalid index');
            this.startMenu();
        }
    }

    addNewDialogQuestion(dialog) 
    {
        rl.question(`Write your new question\n`, answer => 
        {
            let questionObj = new Quest(answer);
            dialog.addQuestion(questionObj);
            console.log('New dialog question was added successfully');
            this.startMenu();
        })
    }

    changeDialogQuestion(dialog, index) 
    {
        if (dialog.questionArr[index])
        {
            rl.question(`- Enter 1 to change question\n- Or enter 2 to change next dialog id\n`, answer =>
            {
                answer = Number(answer);
                if (answer === 1) this.changeDialogQuestionSentence(dialog, index);
                else if (answer === 2) this.changeDialogQuestionNextId(dialog, index);
                else 
                {
                    console.log('Invalid input');
                    this.startMenu();
                }
            })
        } else 
        {
            console.log('Invalid input');
            this.startMenu();
        }
    }

    changeDialogQuestionSentence(dialog, index) 
    {
        rl.question('Enter new dialog question\n', answer => 
        {
            let questionObj = new Quest(answer);
            questionObj.nextDialogId = dialog.questionArr[index].nextDialogId;
            dialog.changeQuestion(questionObj, index);
            console.log('Dialog question was changed successfully\n');
            this.startMenu();
        });
    }

    changeDialogQuestionNextId(dialog, index) 
    {
        rl.question('Enter new next dialog id for the question\n', answer => 
        {
            answer = Number(answer);
            if (answer > 0 && answer < this.storiesLength) 
            {
                dialog.questionArr[index].nextDialogId = answer;
                console.log('Dialog question was changed successfully');
                this.startMenu();
            } else 
            {
                console.log('Invalid id');
                this.startMenu();
            }
        });
    }

    deleteDialogQuestion(dialog, index) 
    {
        if (dialog.questionArr[index]) 
        {
            dialog.deleteQuestion(index);
            console.log('Dialog question was deleted successfully');
            this.startMenu();
        } else 
        {
            console.log('Invalid index');
            this.startMenu();
        }
    }

}

function engine() 
{
    rl.question('\n- Enter 1 to start quest engine\n- Or enter any other symbol to skip this part\n', answer => 
    {
        if (answer === '1') 
        {
            let questEngine = new QuestEngine();
            questEngine.startMenu();
        } else rl.close();
    })
}

module.exports = engine;