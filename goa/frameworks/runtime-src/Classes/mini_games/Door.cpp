//
//  Door.cpp 
//  goa
//

#include "Door.h"
#include "../WordSceneLipiTKNode.h"
#include "DoorNode.h"
#include "../lang/TextGenerator.h"
#include "../menu/HelpLayer.h"
#include "../util/CommonLabel.h"

USING_NS_CC;

//DoorNode * DoorLiPi;

Door::Door()
{
}

Door::~Door()
{

}

Door * Door::create()
{
	Door* hippoGame = new(std::nothrow) Door();
	if (hippoGame && hippoGame->init())
	{
		hippoGame->autorelease();
		return hippoGame;
	}
	CC_SAFE_DELETE(hippoGame);
	return nullptr;
}

cocos2d::Scene * Door::createScene()
{
	auto scene = cocos2d::Scene::create();
	auto layer = Door::create();
	scene->addChild(layer);

	layer->menu = MenuContext::create(layer, "Door");
	scene->addChild(layer->menu);
	return scene;
}

bool Door::init()
{

	if (!Layer::init())
	{
		return false;
	}
	Size visibleSize = Director::getInstance()->getVisibleSize();
	Vec2 origin = Director::getInstance()->getVisibleOrigin();
	auto background = CSLoader::createNode("doors/background.csb");
	extraX = 0;
	if (visibleSize.width > 2560) {
		extraX = (visibleSize.width - 2560) / 2;
		background->setPositionX((visibleSize.width - 2560) / 2);
	}
	this->addChild(background);
	return true;
}
void Door::onEnterTransitionDidFinish()
{

	Size visibleSize = Director::getInstance()->getVisibleSize();
	float box2X = visibleSize.width / 2;

	auto level = menu->getCurrentLevel();
	auto text = TextGenerator::getInstance();

	
	if(level<26)
	{ 
	_alphabet = LangUtil::getInstance()->getAllCharacters()[menu->getCurrentLevel() - 1];
	_randomWord.append(6, _alphabet.at(0));
	}else if(level<36)
	{
		_randomWord = text->generateAWord(menu->getCurrentLevel());
	}else if (level<46)
	{
		_randomWord = text->generateAWord(menu->getCurrentLevel());
	}else if (level<56)
	{
		_randomWord = text->generateAWord(menu->getCurrentLevel());
	}else if (level<66)
	{
		_randomWord = text->generateAWord(menu->getCurrentLevel());
	}
	
	_wordLength = _randomWord.size();

	float boxUpperY = visibleSize.height*0.965;
	float boxLowerY = visibleSize.height*0.48;

	if (_wordLength == 2)
	{
		auto boxInside1 = Sprite::createWithSpriteFrameName("doors/boxinside.png");
		boxInside1->setPosition(Vec2(box2X - boxInside1->getContentSize().width / 1.5, boxUpperY));
		this->addChild(boxInside1);
		boxInside1->setAnchorPoint(Vec2(0.5, 1));
		auto box1 = CSLoader::createNode("doors/box.csb");
		box1->setPosition(Vec2(box2X - boxInside1->getContentSize().width / 1.5, boxUpperY));
		this->addChild(box1);
		_BoxRef.pushBack(box1);
		auto timeline = CSLoader::createTimeline("doors/box.csb");
		box1->runAction(timeline);
		//timeline->play("open", false);

		auto boxInside2 = Sprite::createWithSpriteFrameName("doors/boxinside.png");
		boxInside2->setPosition(Vec2(box2X + boxInside1->getContentSize().width / 1.5, boxUpperY));
		this->addChild(boxInside2);
		boxInside2->setAnchorPoint(Vec2(0.5, 1));
		auto box2 = CSLoader::createNode("doors/box.csb");
		box2->setPosition(Vec2(box2X + boxInside1->getContentSize().width / 1.5, boxUpperY));
		this->addChild(box2);
		_BoxRef.pushBack(box2);
	}

	if(_wordLength==3 || _wordLength==4 || _wordLength==5 || _wordLength==6)
	{ 
	auto boxInside1 = Sprite::createWithSpriteFrameName("doors/boxinside.png");
	boxInside1->setPosition(Vec2(box2X - visibleSize.width / 3.3, boxUpperY));
	this->addChild(boxInside1);
	boxInside1->setAnchorPoint(Vec2(0.5, 1));
	auto box1 = CSLoader::createNode("doors/box.csb");
	box1->setPosition(Vec2(box2X - visibleSize.width/3.3, boxUpperY));
	this->addChild(box1);
	_BoxRef.pushBack(box1);
	

	auto boxInside2 = Sprite::createWithSpriteFrameName("doors/boxinside.png");
	boxInside2->setPosition(Vec2(box2X, boxUpperY));
	this->addChild(boxInside2);
	boxInside2->setAnchorPoint(Vec2(0.5, 1));
	auto box2 = CSLoader::createNode("doors/box.csb");
	box2->setPosition(Vec2(box2X, boxUpperY));
	this->addChild(box2);
	_BoxRef.pushBack(box2);

	auto boxInside3 = Sprite::createWithSpriteFrameName("doors/boxinside.png");
	boxInside3->setPosition(Vec2(box2X + visibleSize.width / 3.3, boxUpperY));
	this->addChild(boxInside3);
	boxInside3->setAnchorPoint(Vec2(0.5, 1));
	auto box3 = CSLoader::createNode("doors/box.csb");
	box3->setPosition(Vec2(box2X + visibleSize.width /3.3, boxUpperY));
	this->addChild(box3);
	_BoxRef.pushBack(box3);
	}

	if (_wordLength == 4)
	{
		auto boxInside4 = Sprite::createWithSpriteFrameName("doors/boxinside.png");
		boxInside4->setPosition(Vec2(box2X , boxLowerY));
		this->addChild(boxInside4);
		boxInside4->setAnchorPoint(Vec2(0.5, 1));
		auto box4 = CSLoader::createNode("doors/box.csb");
		box4->setPosition(Vec2(box2X, boxLowerY));
		this->addChild(box4);
		_BoxRef.pushBack(box4);
	}
	else if (_wordLength == 5)
	{
		auto boxInside4 = Sprite::createWithSpriteFrameName("doors/boxinside.png");
		boxInside4->setPosition(Vec2(box2X - boxInside4->getContentSize().width/1.5, boxLowerY));
		this->addChild(boxInside4);
		boxInside4->setAnchorPoint(Vec2(0.5, 1));
		auto box4 = CSLoader::createNode("doors/box.csb");
		box4->setPosition(Vec2(box2X - boxInside4->getContentSize().width/1.5, boxLowerY));
		this->addChild(box4);
		_BoxRef.pushBack(box4);

		auto boxInside5 = Sprite::createWithSpriteFrameName("doors/boxinside.png");
		boxInside5->setPosition(Vec2(box2X + boxInside4->getContentSize().width/1.5, boxLowerY));
		this->addChild(boxInside5);
		boxInside5->setAnchorPoint(Vec2(0.5, 1));
		auto box5 = CSLoader::createNode("doors/box.csb");
		box5->setPosition(Vec2(box2X + boxInside4->getContentSize().width/1.5, boxLowerY));
		this->addChild(box5);
		_BoxRef.pushBack(box5);
    }
	else if (_wordLength == 6)
	{
		auto boxInside4 = Sprite::createWithSpriteFrameName("doors/boxinside.png");
		boxInside4->setPosition(Vec2(box2X - visibleSize.width / 3.3, boxLowerY));
		this->addChild(boxInside4);
		boxInside4->setAnchorPoint(Vec2(0.5, 1));
		auto box4 = CSLoader::createNode("doors/box.csb");
		box4->setPosition(Vec2(box2X - visibleSize.width / 3.3, boxLowerY));
		this->addChild(box4);
		_BoxRef.pushBack(box4);

		auto boxInside5 = Sprite::createWithSpriteFrameName("doors/boxinside.png");
		boxInside5->setPosition(Vec2(box2X , boxLowerY));
		this->addChild(boxInside5);
		boxInside5->setAnchorPoint(Vec2(0.5, 1));
		auto box5 = CSLoader::createNode("doors/box.csb");
		box5->setPosition(Vec2(box2X, boxLowerY));
		this->addChild(box5);
		_BoxRef.pushBack(box5);

		auto boxInside6 = Sprite::createWithSpriteFrameName("doors/boxinside.png");
		boxInside6->setPosition(Vec2(box2X + visibleSize.width / 3.3, boxLowerY));
		this->addChild(boxInside6);
		boxInside6->setAnchorPoint(Vec2(0.5, 1));
		auto box6 = CSLoader::createNode("doors/box.csb");
		box6->setPosition(Vec2(box2X + visibleSize.width / 3.3, boxLowerY));
		this->addChild(box6);
		_BoxRef.pushBack(box6);
	}
	

	auto box6 = CSLoader::createNode("doors/box.csb");
	float boxWidth = box6->getChildByName("boxdoor_6")->getContentSize().width;
	float boxHeight = box6->getChildByName("boxdoor_6")->getContentSize().height;

	for (int i = 0; i < _BoxRef.size(); i++)
	{
		float x = _BoxRef.at(i)->getPositionX();
		float y = _BoxRef.at(i)->getPositionY() - boxHeight/2;
		
		_doorNode = DoorNode::create(boxWidth, boxHeight,Vec2( x, y));
		this->addChild(_doorNode);
		_doorNode->setParent(this);
		_doorNodeRef.pushBack(_doorNode);
		_doorNode->writingEnable(false);
	}
	if (_score == 0)
	{
		_doorNodeRef.at(_score)->writingEnable(true);
	}
	
	for (int i = 0; i<_wordLength; i++)
	{
		float x = _BoxRef.at(i)->getPositionX();
		float y = _BoxRef.at(i)->getPositionY() - boxHeight / 2;

		_myWord = _randomWord.at(i);
		auto myLabel = CommonLabel::createWithBMFont(LangUtil::getInstance()->getBMFontFileName(), _myWord);
		myLabel->setPositionX(x);
		myLabel->setPositionY(y);
		myLabel->setScale(0.8);
		this->addChild(myLabel);
		auto fadeOut = FadeOut::create(3.0f);
		myLabel->runAction(fadeOut);
	}
	if (menu->getCurrentLevel() == 1) {
		gameHelpLayer();
	}
	
}
void Door::gameHelpLayer()
{
	Size visibleSize = Director::getInstance()->getVisibleSize();
	auto helpLayer = HelpLayer::create(Rect(_BoxRef.at(0)->getPositionX(), _BoxRef.at(0)->getPositionY() - _BoxRef.at(0)->getChildByName("boxdoor_6")->getContentSize().height / 2, _BoxRef.at(0)->getChildByName("boxdoor_6")->getContentSize().width, _BoxRef.at(0)->getChildByName("boxdoor_6")->getContentSize().height), Rect(0, 0, 0, 0));
	std::vector <Point> points;
	
	float boxWidth = _BoxRef.at(0)->getChildByName("boxdoor_6")->getContentSize().width/2;
	float boxHeight = _BoxRef.at(0)->getChildByName("boxdoor_6")->getContentSize().height/2;
	
	float x = _BoxRef.at(0)->getPositionX();
	float y = _BoxRef.at(0)->getPositionY() - boxHeight;
	points.push_back(Vec2(x - boxWidth / 1.25, y - boxHeight*0.6));
	points.push_back(Vec2(x, y + boxHeight*0.7));
	points.push_back(Vec2(x + boxWidth / 1.25, y - boxHeight*0.6));
	points.push_back(Vec2(x - boxWidth / 2, y - boxHeight*0.1));
	points.push_back(Vec2(x + boxWidth / 2, y - boxHeight*0.1));
	helpLayer->writing(points);
	this->addChild(helpLayer);
	helpLayer->setName("gameHelpLayer");
}
void Door::clearScreen(float dt)
{
	if (_score < _randomWord.size())
	{
		_doorNodeRef.at(_score)->clearDrawing(nullptr, cocos2d::ui::Widget::TouchEventType::ENDED);
	}
}

void Door::showScore(float dt)
{
	menu->showScore();
}

void Door::characterRecognisation(std::vector<string> str)
{
	this->removeChildByName("gameHelpLayer");
	char letter= _randomWord.at(_score);
	string word(&letter, 1);
	CCLOG("character = %s", str.at(0).c_str());
	if (str.at(0).compare(word) == 0)
	{
		auto timeline = CSLoader::createTimeline("doors/box.csb");
		_BoxRef.at(_score)->runAction(timeline);
		timeline->play("open", false);

		_animalRef = {"sheep","pig","cow"};
		auto path = "doors/" + _animalRef.at(cocos2d::RandomHelper::random_int(0, 2)) + ".csb";
		auto boxInside = Sprite::createWithSpriteFrameName("doors/boxinside.png");
		auto animal = CSLoader::createNode(path);
		animal->setPositionX(_BoxRef.at(_score)->getPositionX() - boxInside->getContentSize().width/8);
		animal->setPositionY(_BoxRef.at(_score)->getPositionY() - boxInside->getContentSize().height/2);
		this->addChild(animal);
		auto timeline1 = CSLoader::createTimeline(path);
		animal->runAction(timeline1);
		timeline1->play("walk", true);
		if (_score < _randomWord.size())
		{
			_doorNodeRef.at(_score)->writingEnable(false);
		}
		_score++;
		if (_score < _randomWord.size())
		{
			_doorNodeRef.at(_score)->writingEnable(true);
		}
		if (_score == _randomWord.size())
		{
			this->scheduleOnce(schedule_selector(Door::showScore), 6);
		}
	}
	else
	{
		this->unschedule(schedule_selector(Door::clearScreen));
		this->scheduleOnce(schedule_selector(Door::clearScreen), 3);
	}
}
