import Scene from '../../scene/objects/Scene.js';
import Floor from '../../scene/objects/Floor.js';
import Wall from '../../scene/objects/Wall.js';
import Texture from '../../scene/objects/Texture.js';
import TileTexture from '../../scene/objects/TileTexture.js';
import Item from '../../scene/objects/Item.js';
import Holder from '../../scene/objects/Holder.js';
import Surface from '../../scene/objects/Surface.js';
import Human from '../../puppet/objects/Human.js';
import Puppet from '../../puppet/objects/Puppet.js';
import TabView from '../../puppet/objects/TabView.js';
import JsonUtil from '../../puppet/objects/JsonUtil.js';
import StoryUtil from '../objects/StoryUtil.js';
import RecordingManager from '../objects/RecordingManager.js';
import ShowAttributeEditorSignal from '../objects/ShowAttributeEditorSignal.js';
import AttributeEditOverlay from '../objects/AttributeEditOverlay.js';
import QuestionTypeOverlay from '../objects/QuestionTypeOverlay.js';
import StoryBuilderInputHandler from '../objects/StoryBuilderInputHandler.js';
import StoryPuppetBuilderInputHandler from '../objects/StoryPuppetBuilderInputHandler.js';
import ConsoleBar from '../../util/ConsoleBar.js';

import Library from '../objects/Library.js';
import Story from '../objects/Story.js';
import StoryPage from '../objects/StoryPage.js';
import ButtonGrid from '../../puppet/objects/ButtonGrid.js';
import PersistRecordingInformationSignal from '../objects/PersistRecordingInformationSignal.js'
import PlayResumeSignal from '../objects/PlayResumeSignal.js';
import RecordingStartSignal from '../objects/RecordingStartSignal.js';

import SpecialAttribute from '../../scene/objects/SpecialAttribute.js';
import SoundData from '../../scene/objects/SoundData.js';

import PuppetCustomizer from '../../puppet/objects/PuppetCustomizer.js';

import RecordingPlayEndSignal from '../objects/RecordingPlayEndSignal.js'


var _ = require('lodash');
var idObject = new Object();
//rename to BuildYourOwnStoryEditorState
export default class ConstructNewStoryPageState extends Phaser.State {
    init(currentStoryId, currentPageId, cachedJSONRepresentation, sceneOrPuppetType) {
        this._currentStoryId = currentStoryId;
        this._currentPageId = currentPageId;
        this._cachedJSONStrRep = cachedJSONRepresentation;
        this._sceneOrPuppetType = sceneOrPuppetType;

        this.onPersistRecordingInformationSignal = new PersistRecordingInformationSignal();
        this.onPersistRecordingInformationSignal.add(this.persistRecordingInformation, this);

        this._playResumeSignal = new PlayResumeSignal();

        this._recordingStartSignal = new RecordingStartSignal();
        this._recordingStartSignal.add(this.notifiedWhenRecordingStarts, this);

        this._screenshotGenerated = false;

        this._recordingPlayEndSignal = new RecordingPlayEndSignal();
        this._recordingPlayEndSignal.add(this.displayButtonOnrecordingPlayEnd, this);
    }

    notifiedWhenRecordingStarts() {
        this.saveToLocalStore();
    }

    loadStoryFromLocalStorage(currentStoryId) {
        //cache current story Id
        let storyJSON = localStorage.getItem(currentStoryId);
        let currentStory = JSON.parse(storyJSON);
        return currentStory;
    }

    loadStoryPageToEdit() {
        let storyPage = null;
        this._currentStory.storyPages.forEach(function(page, index) {
            if (page.pageId === this._currentPageId) {
                storyPage = page;

                if (index === 0) {
                    this._isTitlePage = true;
                }
            }
        }, this);
        return storyPage;
    }

    preload() {
        this.load.atlas('scene/bank', "assets/scene/bank.png", "assets/scene/bank.json");
        this.load.atlas('scene/scene', "assets/scene/scene.png", "assets/scene/scene.json");
        this.load.atlas('misc/theme', "assets/misc/theme.png", "assets/misc/theme.json");
        this.load.atlas('scene/icons', "assets/scene/icons.png", "assets/scene/icons.json");
        this.load.json('scene/menu_icons', 'assets/scene/menu_icons.json');
        this.load.json('storyBuilder/puppet_themes', 'assets/storyBuilder/puppet_themes.json');

        this.load.image('storybuilder/choose_prop_button', 'assets/storyBuilder/prop_button.png');
        this.load.image('storybuilder/choose_character_button', 'assets/storyBuilder/prop_button.png');
        this.load.image('storybuilder/choose_background_button', 'assets/storyBuilder/prop_button.png');
        this.load.image('storybuilder/setting_button', 'assets/storyBuilder/setting_button.png');
        this.load.image('storybuilder/plus', 'assets/storyBuilder/plus_button.png');

        //load sounds for items
        this.load.audio('storyBuilder/audio1', 'assets/storyBuilder/sounds/audio_1.mp3');
        this.load.audio('storyBuilder/audio2', 'assets/storyBuilder/sounds/audio_2.mp3');

        this.load.atlas('misc/theme', "assets/misc/theme.png", "assets/misc/theme.json");
        this.load.atlas('puppet/chooser', 'assets/puppet/chooser.png', 'assets/puppet/chooser.json');
        this.load.atlas('puppet/sample', 'assets/puppet/sample.png', 'assets/puppet/sample.json');
        this.load.atlas('puppet/icons', 'assets/puppet/icons.png', 'assets/puppet/icons.json');
        this.load.atlas('scene/icons', 'assets/scene/icons.png', 'assets/scene/icons.json');
        this.load.atlas('puppet/characters', 'assets/puppet/characters.png', 'assets/puppet/characters.json');
        this.load.atlas('puppet/eye_mouth', 'assets/puppet/eye_mouth.png', 'assets/puppet/eye_mouth.json');
        //this.load.atlas('puppet/sample', 'assets/puppet/sample.png', 'assets/puppet/sample.json');
        this.load.json('puppet/accessorize', 'assets/puppet/accessorize.json');
        this.load.json('puppet/menu_accessorize', 'assets/puppet/menu_accessorize.json');
        this.load.atlas('puppet/headshape', 'assets/puppet/headshape.png', 'assets/puppet/headshape.json');


        // //for now statically load audio
        // this.load.audio('audio_1', 'assets/storyBuilder/sounds/audio_1.mp3');
        // this.load.audio('audio_2', 'assets/storyBuilder/sounds/audio_2.mp3');

        this.load.script('gray', 'https://cdn.rawgit.com/photonstorm/phaser/master/filters/Gray.js');

        this.loadScenesConfiguration();
        this.loadPuppetsConfiguration();

        this._currentStory = this.loadStoryFromLocalStorage(this._currentStoryId);
        this._currentPage = this.loadStoryPageToEdit();
    }

    loadScenesConfiguration() {
        this._sceneConfig = this.game.cache.getJSON('storyBuilder/scene_config');
    }

    loadPuppetsConfiguration() {
        this._puppetConfig = this.game.cache.getJSON('storyBuilder/puppet_config');
    }

    create() {

        this._consoleBar = new ConsoleBar(this.game);
        this.game.add.existing(this._consoleBar);


        this._displayControlGroup = this.game.add.group();
        this._displayControlGroup.inputEnabled = true;
        this._displayControlGroup.x = 0;
        this._displayControlGroup.y = this._consoleBar.consoleBarHeight();
        this.initializeRecordingManager();
        
        this.loadExistingSceneToEdit();

        this.constructStory();

        this.enableInputsOnScene();

        this.setUpUI();
        
        // this.hideAllControls();

    }

    setUpUI() {
        this.createActionButtons();
    }


    loadExistingSceneToEdit() {
        let page = JSON.parse(JSON.stringify(this._currentPage), JsonUtil.revive);
        this._loadedScene = page.scene;
        //var gray = this.game.add.filter('Gray');
        //this._loadedScene.filters = [gray];

        this._displayControlGroup.add(this._loadedScene);
        //remove any direct child of world 
        this.game.world.children.forEach(function(element) {
            console.log(element);
            if (element instanceof Scene) {
                this.game.world.removeChild(element);
            }
        }, this);
    }


    findAllPuppetsInScene(scene) {
        let puppets = [];
        scene.children.forEach(function(elementChild) {
            //could be Wall/Floor
            let parent = null;
            if (elementChild instanceof Wall) {
                parent = elementChild;
            } else if (elementChild instanceof Floor) {
                parent = elementChild;
            }

            if (parent) {
                parent.children.forEach(function(child) {
                    if (child instanceof Puppet) {
                        puppets.push(child);
                    }
                })
            }
        }, this);
        return puppets;
    }

    updateGroupWithScene(jsonSceneRepresentation) {
        //remove any previous scene type child
        let puppets = null;
        this._displayControlGroup.children.forEach(function(element) {
            console.log(element);
            if (element instanceof Scene) {

                puppets = this.findAllPuppetsInScene(element);
                //iterate all child and copy all children of type Puppet
                this._displayControlGroup.removeChild(element);
            }
        }, this);
        let newScene = JSON.parse(jsonSceneRepresentation, JsonUtil.revive);
        if (puppets) {
            puppets.forEach(function(puppet) {
                newScene.floor.addContent(puppet);
            }, this);
        }

        this._displayControlGroup.add(newScene);
    }

    enableInputsOnScene() {
        this._displayControlGroup.children.forEach(function(element) {
            console.log(element);
            if (element instanceof Scene) {
                let scene = element;
                element.floor.textures.forEach(function(element) {
                    element.enableInputs(new StoryBuilderInputHandler(scene), false);
                    element.disableDrag(new StoryBuilderInputHandler(scene), true);
                }, this);

                element.wall.textures.forEach(function(element) {
                    element.enableInputs(new StoryBuilderInputHandler(scene), false);
                    element.disableDrag(new StoryBuilderInputHandler(scene), true);
                }, this);


                element.floor.contents.forEach(function(element) {
                    if (element instanceof Puppet) {
                        element.body.enableInputs(new StoryPuppetBuilderInputHandler(game), false);
                    } else {
                        element.enableInputs(new StoryBuilderInputHandler(scene), false);
                    }

                }, this);

                element.wall.contents.forEach(function(element) {
                    element.enableInputs(new StoryBuilderInputHandler(scene), false);
                }, this);
            }
        }, this);

    }

    constructStory() {

        if (this._cachedJSONStrRep && this._sceneOrPuppetType) {
            if (this._sceneOrPuppetType == ConstructNewStoryPageState.SCENE_TYPE) {
                this.updateGroupWithScene(this._cachedJSONStrRep);
            } else if (this._sceneOrPuppetType == ConstructNewStoryPageState.PUPPET_TYPE) {
                this._puppet = JSON.parse(this._cachedJSONStrRep, JsonUtil.revive);
                this.positionAddedPuppetOnScene(this._puppet);
            }
            this._screenshotGenerated = false;
        }
    }

    positionAddedPuppetOnScene(puppet) {
        puppet.x = game.width * Math.random();
        puppet.y = game.height * Math.random();
        puppet.body.disableInputs();
        puppet.body.enableInputs(new StoryPuppetBuilderInputHandler(game), false);
        this._displayControlGroup.children.forEach(function(element) {
            console.log(element);
            if (element instanceof Scene) {
                element.floor.addContent(puppet)
            }
        }, this);
    }

    saveToLocalStore() {
        this._displayControlGroup.children.forEach(function(element) {
            if (element instanceof Scene) {
                let jsonStr = JSON.stringify(element, JsonUtil.replacer);
                this._currentPage.scene = element;
            }
        }, this);

        this._currentStory.storyPages.forEach(function(page) {
            if (page.pageId === this._currentPageId) {
                page = this._currentPage;
                //                this._currentPage.questionsAndAnswers = [];
                localStorage.setItem(this._currentStory.storyId, JSON.stringify(this._currentStory, JsonUtil.replacer));
            }
        }, this);


    }

    hideAllControls() {
        // this._homeButton.visible = false;
        // this._chooseBackGroundButton.visible = false;
        // this._chooseCharacterButton.visible = false;
        // this._questionAndAnswerButton.visible = false;
        // this._testResumePlayButton.visible = false;

        // this.recordingManager.hideAllControls();
    }


    showAllControls() {
        // this._homeButton.visible = true;
        // this._chooseBackGroundButton.visible = true;
        // this._chooseCharacterButton.visible = true;
        // this._questionAndAnswerButton.visible = true;
        // this._testResumePlayButton.visible = true;
        // this.recordingManager.showAllControls();
    }

    defineControls(tab, name) {
        console.log('name:' + name);
        if(name === ConstructNewStoryPageState.HOME_BUTTON) {
            this.navigateToLibrary();
        } else if(name === ConstructNewStoryPageState.ADD_BACKGROUND_BUTTON) {
            this.chooseBackGround();
        } else if(name === ConstructNewStoryPageState.ADD_CHARACTER_BUTTON) {
            this.choosePuppet();
        } 
        //else if(name === ConstructNewStoryPageState.ADD_PROPS_BUTTON) {
            
        // } 
        else if(name === ConstructNewStoryPageState.ADD_QUESTION_ANWSERS_BUTTON) {
            this.createQuestionAndAnswer();
        } else if(name === ConstructNewStoryPageState.ADD_RECORD_BUTTON) {            
            this.recordingManager.toggleRecording.call(this.recordingManager);
        } else if(name === ConstructNewStoryPageState.ADD_PLAY_BUTTON) {
            this.recordingManager.narrateStory.call(this.recordingManager);            
        }
    }

    createActionButtons() {

        this._consoleBar.createRightButtonGrid(
            [ConstructNewStoryPageState.HOME_BUTTON,
                ConstructNewStoryPageState.ADD_BACKGROUND_BUTTON,
                ConstructNewStoryPageState.ADD_CHARACTER_BUTTON,
                ConstructNewStoryPageState.ADD_PROPS_BUTTON,
                ConstructNewStoryPageState.ADD_QUESTION_ANWSERS_BUTTON,
                ConstructNewStoryPageState.ADD_RECORD_BUTTON,
                ConstructNewStoryPageState.ADD_PLAY_BUTTON],
            this.defineControls, this);

        // this._homeButton = this.game.make.sprite(this.game.width - 40, 40, 'storybuilder/home_button');
        // this._homeButton.anchor.setTo(0.5);
        // this._homeButton.inputEnabled = true;
        // this._homeButton.events.onInputDown.add(this.navigateToLibrary, this);
        // this._homeButton.input.priorityID = 2;
        // this._displayControlGroup.add(this._homeButton);
        // this._homeButton.visible = false;



        // this._chooseBackGroundButton = this.game.make.sprite(this.game.width - 100, 40, 'storybuilder/home_button');
        // this._chooseBackGroundButton.anchor.setTo(0.5);
        // this._chooseBackGroundButton.inputEnabled = true;
        // this._chooseBackGroundButton.events.onInputDown.add(this.chooseBackGround, this);
        // this._chooseBackGroundButton.x = this._homeButton.x - this._homeButton.width;
        // this._chooseBackGroundButton.y = this._homeButton.y;

        // this._displayControlGroup.add(this._chooseBackGroundButton);

        // this._chooseCharacterButton = this.game.make.sprite(this.game.width - 160, 40, 'storybuilder/home_button');
        // this._chooseCharacterButton.anchor.setTo(0.5);
        // this._chooseCharacterButton.inputEnabled = true;
        // this._chooseCharacterButton.x = this._chooseBackGroundButton.x - this._chooseBackGroundButton.width;
        // this._chooseCharacterButton.y = this._homeButton.y;
        // this._chooseCharacterButton.events.onInputDown.add(this.choosePuppet, this);
        // this._displayControlGroup.add(this._chooseCharacterButton);


        // this._questionAndAnswerButton = this.game.make.sprite(this.game.width - 260, 40, 'storybuilder/home_button');
        // this._questionAndAnswerButton.anchor.setTo(0.5);
        // this._questionAndAnswerButton.inputEnabled = true;
        // this._questionAndAnswerButton.events.onInputDown.add(this.createQuestionAndAnswer, this);
        // this._questionAndAnswerButton.input.priorityID = 2;
        // this._displayControlGroup.add(this._questionAndAnswerButton);


        // this._testResumePlayButton = this.game.make.sprite(this.game.width - 340, 40, 'storybuilder/home_button');
        // this._testResumePlayButton.anchor.setTo(0.5);
        // this._testResumePlayButton.inputEnabled = true;
        // this._testResumePlayButton.events.onInputDown.add(this.testing, this);
        // this._testResumePlayButton.input.priorityID = 2;
        // this._displayControlGroup.add(this._testResumePlayButton);
        // this._soundAdded = false;

        // this._askQuestionButton = this.game.make.sprite(this.game.width - 420, 40, 'storybuilder/home_button');
        // this._askQuestionButton.anchor.setTo(0.5);
        // this._askQuestionButton.inputEnabled = true;
        // this._askQuestionButton.events.onInputDown.add(this.askQuestions, this);
        // this._askQuestionButton.input.priorityID = 2;
        // this._displayControlGroup.add(this._askQuestionButton);

        this._nextButton = this.game.make.sprite(this.game.width - 40, 240, 'storybuilder/home_button');
        this._nextButton.anchor.setTo(0.5);
        this._nextButton.alpha = 0;
        this._nextButton.inputEnabled = true;
        this._nextButton.events.onInputDown.add(this.nextButton, this);
        this._nextButton.input.priorityID = 2;
        this._displayControlGroup.add(this._nextButton);

        this._editPuppet = game.add.button(this.game.width - 30, 60, 'scene/icons', this.editPuppet, this, 'ic_grid_on_black_24dp_1x.png', 'ic_grid_on_black_24dp_1x.png', 'ic_grid_on_black_24dp_1x.png', 'ic_grid_on_black_24dp_1x.png');
        this._editPuppet.anchor.setTo(0.5, 0.5);
        //this._editPuppet.visible = false;
    }


    editPuppet() {
        this._displayControlGroup.add(new PuppetCustomizer(this.game, this.game.width, this.game.height, this.puppet, this.addPuppet, this));
    }

    //add or update Puppet
    addPuppet(puppet) {
        if (this.puppet == null) {
            this.puppet = puppet;
        }

        this.positionAddedPuppetOnScene(this.puppet);
        this._screenshotGenerated = false;
    }

    testing() {
        if (!this._soundAdded) {
            this._testItemClicked.applySound(0, true);
            this._soundAdded = true;
        } else {
            this._testItemClicked.applySound(0, false);
            this._soundAdded = false;
        }
    }

    // when recording play ends then we will show next button to ask the questions
    displayButtonOnrecordingPlayEnd() {
        this._nextButton.alpha = 1;

        window.callback = this.returnPageJson;
        window.callbackContext = this;

        console.log('hello');
    }

    createQuestionAndAnswer(item, pointer) {
        this._QuestionTypeOverlay = new QuestionTypeOverlay(game, game.width, game.height, item, pointer, this, this.saveQuestionInLocal, this._currentPage.questionsAndAnswers);
        idObject.storyId = this._currentStory.storyId;
        idObject.pageId = this._currentPage.pageId;
    }


    saveQuestionInLocal(get_json_from_local) {
        console.log(get_json_from_local);

        if (get_json_from_local == undefined)
            return 0;

        for (var i = 0; i < get_json_from_local.length; i++) {
            this._currentPage.questionsAndAnswers.push(get_json_from_local[i]);
        }
        this.saveToLocalStore();
    }

    // after recording play end will show next button to ask the questions
    nextButton() {
        console.log("next button");
        window.display_question_multichoice();
    }

    askQuestions() {
        $("#Question_css").css({ "visibility": "visible", "display": "none" });

        idObject.storyId = this._currentStory.storyId;
        idObject.pageId = this._currentPage.pageId;
    }

    // return json of current page
    returnPageJson() {
        return this._currentPage.questionsAndAnswers;
    }

    chooseBackGround(sprite, pointer) {
        if (this._choosePuppetTab) {
            this._choosePuppetTab.visible = false;
        }

        this.createChooseBackGroundTab();
        this._chooseBackGroundTab.visible = true;
    }

    choosePuppet(sprite, pointer) {
        if (this._chooseBackGroundTab) {
            this._chooseBackGroundTab.visible = false;
        }

        this.createChoosePuppetTab();
        this._choosePuppetTab.visible = true;
    }


    navigateToLibrary() {
        this.game.state.start('StoryBuilderLibraryState');
    }

    createChooseBackGroundTab() {
        let backGroundThemes = this.game.cache.getJSON('storyBuilder/background_themes');
        //later get from texture packer
        let forestNames = ["forest_1_th", "forest_2_th", "forest_3_th", "forest_4_th", "forest_5_th", "forest_6_th", "forest_7_th"];
        let villageNames = ["village_1_th", "village_2_th", "village_3_th", "village_4_th", "village_5_th", "village_6_th", "village_7_th"];

        this._chooseBackGroundTab = this._displayControlGroup.add(new TabView(this.game, 'scene/scene', this.game.width * 0.9, this.game.height, 10, 50, 5, 3, true, function(tab, button) {
            this._chooseBackGroundTab.unSelect();
            this.dynamicallyLoadAssets(button, ConstructNewStoryPageState.SCENE_TYPE, this._sceneConfig);
            this._chooseBackGroundTab.visible = false;
        }, this, backGroundThemes));

        this._chooseBackGroundTab.tabs = { 'forest': forestNames, 'village': villageNames };
        this._chooseBackGroundTab.x = this.game.width * 0.05;
        this._chooseBackGroundTab.y = 0;
        this._chooseBackGroundTab.fixedToCamera = true;
        this._chooseBackGroundTab.visible = false;
    }

    createChoosePuppetTab() {

        let puppetThemes = this.game.cache.getJSON('storyBuilder/puppet_themes');
        //later get from texture packer
        let humanNames = ["american_football_th"];

        this._choosePuppetTab = this._displayControlGroup.add(new TabView(this.game, 'Puppet', this.game.width * 0.9, this.game.height, 10, 50, 5, 3, true, function(tab, button) {
            this._choosePuppetTab.unSelect();
            console.log('button:' + button);
            console.log('tab:' + tab);
            //place item on game
            //load puppet for selected button
            this.dynamicallyLoadAssets(button, ConstructNewStoryPageState.PUPPET_TYPE, this._puppetConfig);
            this._choosePuppetTab.visible = false;
        }, this, puppetThemes));

        this._choosePuppetTab.tabs = { 'human1': humanNames, 'human2': humanNames };
        this._choosePuppetTab.x = this.game.width * 0.05;
        this._choosePuppetTab.y = 0;
        this._choosePuppetTab.fixedToCamera = true;
        this._choosePuppetTab.visible = false;
    }

    initializeRecordingManager() {
        //give current recording counter and map of data to play if already recording is present for current page        
        this.recordingManager = new RecordingManager(game, this._currentPage.totalRecordingCounter, this._currentPage.recordedInformation);
        this._showAttributeEditorSignal = new ShowAttributeEditorSignal();
        this._showAttributeEditorSignal.add(this.showAttributeEditor, this);
    }


    dynamicallyLoadAssets(assetName, type, config) {
        this._configToLoad = config[type][assetName];
        this.game.state.start('StoryOnDemandLoadState', true, false, this._currentStoryId, this._currentPageId, this._configToLoad, this.game.state.getCurrentState().key, type);
    }

    showAttributeEditor(item, pointer) {
        //sound testing
        if (item instanceof TileTexture) {

        } else {
            // this._testItemClicked = item;
            // //add sounds
            // let music = new SoundData(game, 'audio_1', false);
            // item.addSound(music);

        }
        if (!this._AttributeEditOverlay) {
            this._AttributeEditOverlay = new AttributeEditOverlay(game, game.width, game.height);
        }

        this._AttributeEditOverlay.addClickedObject(item);
    }


    persistRecordingInformation(recordedInformation, totalRecordingCounter) {
        console.log('received:' + recordedInformation + ' and totalRecordingCounter:' + totalRecordingCounter);
        //set into page JSON
        this._currentPage.recordedInformation = recordedInformation;
        this._currentPage.totalRecordingCounter = totalRecordingCounter;
        this.saveToLocalStore();
    }

    shutdown() {
    }


    render() {
        this.generateSnapShot();
        // game.debug.inputInfo(32, 32);
        // game.debug.pointer(game.input.activePointer);

    }


    generateSnapShot() {
        if (!this._screenshotGenerated) {
            let imageDataURI = document.getElementById("gameCanvas").children[0].toDataURL();
            //update page                        
            this._screenshotGenerated = true;
            this._currentPage.imageData = imageDataURI;

            //update to story level

            this.updateGenereatedScreenShotIfTitlePage(imageDataURI);
            //update to library 
            this.saveToLocalStore();
            this.showAllControls();
        }

    }


    loadLibraryFromLocalStorage() {
        //cache current story Id
        let library = null;
        let libraryJSON = localStorage.getItem(ConstructNewStoryPageState.LIBRARY_KEY);
        if (libraryJSON) {
            library = JSON.parse(libraryJSON);
        }
        return library;
    }

    loadLibraryStoryFromLocalStorage(library) {
        //cache current story Id
        let libStory = null;
        if (library) {
            if (library && library.stories)
                library.stories.forEach(function(libraryStory) {
                    if (libraryStory.storyId == this._currentStory.storyId) {
                        libStory = libraryStory;
                    }
                }, this);
        }
        return libStory;
    }


    updateGenereatedScreenShotIfTitlePage(imageDataURI) {
        if (this._isTitlePage) {
            //get library from localstorage
            let library = this.loadLibraryFromLocalStorage();
            let curLibraryStory = this.loadLibraryStoryFromLocalStorage(library);
            curLibraryStory.imageData = imageDataURI;

            library.stories.forEach(function(libraryStory) {
                if (libraryStory.storyId == this._currentStory.storyId) {
                    libraryStory = curLibraryStory;
                }
            }, this);

            localStorage.setItem(ConstructNewStoryPageState.LIBRARY_KEY, JSON.stringify(library));
        }
    }
}

ConstructNewStoryPageState.SCENE_TYPE = 'scenes';
ConstructNewStoryPageState.PUPPET_TYPE = 'puppets';
ConstructNewStoryPageState.LIBRARY_KEY = 'library';



ConstructNewStoryPageState.HOME_BUTTON = 'Home.png';
ConstructNewStoryPageState.ADD_BACKGROUND_BUTTON = 'group.png';
ConstructNewStoryPageState.ADD_CHARACTER_BUTTON = 'numbers.sketch/QuickLook/Preview.png';
ConstructNewStoryPageState.ADD_PROPS_BUTTON = 'explore.png';
ConstructNewStoryPageState.ADD_QUESTION_ANWSERS_BUTTON = 'explore.png';
ConstructNewStoryPageState.ADD_RECORD_BUTTON = 'Skin_tone.png';
ConstructNewStoryPageState.ADD_PLAY_BUTTON = 'Pant.png';
