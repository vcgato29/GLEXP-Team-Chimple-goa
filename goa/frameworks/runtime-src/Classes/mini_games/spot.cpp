#include "spot.h"


USING_NS_CC;

Scene* spot::createScene()
{
	auto scene = Scene::create();
	auto layer = spot::create();
	scene->addChild(layer);
	layer->_menuContext = MenuContext::create(layer, spot::gameName());
	scene->addChild(layer->_menuContext);
	return scene;
}


spot *spot::create() {
	spot *spots = new (std::nothrow) spot();
	if (spots && spots->init()) {
		spots->autorelease();
		return spots;
	}
	CC_SAFE_DELETE(spots);
	return nullptr;

}

spot::spot():_answerValue(0) {



}

bool spot::init()
{
	if (!Layer::init()) { return false; }

	return true;
}

void spot::onEnterTransitionDidFinish() {

	Size visibleSize = Director::getInstance()->getVisibleSize();
	Vec2 origin = Director::getInstance()->getVisibleOrigin();


	_level = _menuContext->getCurrentLevel();
	_answerValue = _level + 10;


	_menuContext->setMaxPoints(1);

	const int numberOfPages = 3;


	_bg = CSLoader::createNode("spot/background.csb"); 
	_bg->setContentSize(Size(visibleSize.width * numberOfPages, visibleSize.height));


	_bg->setAnchorPoint(Vec2(0.5, 0.5));
	_bg->setPosition(Vec2(numberOfPages * visibleSize.width / 2, visibleSize.height/2));
	//backgroundSpriteMapTile->setScaleY(0.9);
	
	//_layer = Layer::create();
	//_layer->setContentSize(Size(visibleSize.width * 3, visibleSize.height));
	//_layer->setPosition(Vec2(0, 0));
	//addChild(_layer);
	
	
	Node *questionPlate = CSLoader::createNode("spot/spot.csb");
	questionPlate->setContentSize(Size(visibleSize.width * numberOfPages, visibleSize.height * 0.1));
	questionPlate->setAnchorPoint(Vec2(0.5, 0.5));
	questionPlate->setPosition(Vec2(numberOfPages * visibleSize.width / 2, visibleSize.height / 14));



	//Vector <Node*> children = _bg->getChildren();
	//int size = children.size();
	//for (auto item = children.rbegin(); item != children.rend(); ++item) {
	//	Node * monsterItem = *item;
	//	std::string str = monsterItem->getName().c_str();
	//	CCLOG("name : %s", str.c_str());
	//}


	_scrollView = ui::ScrollView::create();
	
	_scrollView->setDirection(ui::ScrollView::Direction::HORIZONTAL);
	_scrollView->setContentSize(visibleSize);
	_scrollView->setInnerContainerSize(_bg->getContentSize());
	this->addChild(_scrollView);
	_answerValue = 0;
	addAnimals();
	addCalculator();


	auto listener = EventListenerTouchOneByOne::create();
	listener->onTouchBegan = CC_CALLBACK_2(spot::onTouchBegan, this);
	listener->setSwallowTouches(false);

	_eventDispatcher->addEventListenerWithSceneGraphPriority(listener->clone(), questionPlate->getChildByName("cal"));

	std::string countAnimal;

	switch (_menuContext->getCurrentLevel()) {

	case 1:countAnimal = "buffaloes"; break;
	case 2:countAnimal = "cows"; break;
	case 3:countAnimal = "goats"; break;
	case 4:countAnimal = "horses"; break;
	case 5:countAnimal = "pigs"; break;
	case 6:countAnimal = "sheeps"; break;

	}

	_label = ui::Text::create();
	_label->setFontName("fonts/Marker Felt.ttf");
	_label->setString("How many " + countAnimal +" are there?");
	_label->setFontSize(100);
	_label->setPosition(Vec2(visibleSize.width / 4, visibleSize.height / 14));
	_label->setAnchorPoint(Vec2(0, 0));
	_label->setName("label");
	_label->setTextColor(Color4B::BLUE);
	_label->setColor(Color3B::RED);
	_label->setScaleX(1);
	_label->setScaleY(1);


	_scrollView->addChild(_label,15);


	_scrollView->addChild(_bg, 10);
	
	_scrollView->addChild(questionPlate, 10);

	CCLOG("%d", _answerValue);

	this->scheduleUpdate();

}

void spot::update(float delta) {


	if (_calculateFlag == 0 && _calculator->checkAnswer(_answerValue)) {

		CCLOG("correct answer");
		_calculateFlag = 1;

		auto ShowScore = CallFunc::create([=] {

			_menuContext->addPoints(1);
			_menuContext->showScore();

		});


		auto scoreSequenceOne = Sequence::create(DelayTime::create(0.5), ShowScore, NULL);
		this->runAction(scoreSequenceOne);

	}
}

spot::~spot(void)
{
	this->removeAllChildrenWithCleanup(true);
}


void spot::gameHelpLayer()
{


	Size visibleSize = Director::getInstance()->getVisibleSize();
	_help = HelpLayer::create(Rect(visibleSize.width / 2, visibleSize.height / 2, visibleSize.width / 2.8, visibleSize.height * 0.4), Rect(0, 0, 0, 0));
	std::vector <Point> points;
	float boxWidth = (visibleSize.width / 2.8) / 2;
	float boxHeight = (visibleSize.height * 0.4) / 2;
	points.push_back(Vec2(visibleSize.width / 2 - boxWidth / 1.25, visibleSize.height / 2 - boxHeight*0.6));
	points.push_back(Vec2(visibleSize.width / 2, visibleSize.height / 2 + boxHeight*0.7));
	points.push_back(Vec2(visibleSize.width / 2 + boxWidth / 1.25, visibleSize.height / 2 - boxHeight*0.6));
	points.push_back(Vec2(visibleSize.width / 2 - boxWidth / 2, visibleSize.height / 2 - boxHeight*0.1));
	points.push_back(Vec2(visibleSize.width / 2 + boxWidth / 2, visibleSize.height / 2 - boxHeight*0.1));
	_help->writing(points);
	this->addChild(_help);
	_help->setName("gameHelpLayer");
}







void spot::addCalculator() {

	Size visibleSize = Director::getInstance()->getVisibleSize();
	Vec2 origin = Director::getInstance()->getVisibleOrigin();

	_calculator = new Calculator();
	_calculator->createCalculator(Vec2(visibleSize.width/2 + 1000, visibleSize.height/3), Vec2(0.5, 0.5), 0.5, 0.5);
	_scrollView->addChild(_calculator, 15);
	//_calculator->setGlobalZOrder(2);
	_calculator->setVisible(false);

}

void spot::addAnimals() {

	std::string animalsName[] = { "","buffalo", "cow", "goat", "horse","pig","sheep" };

	Vector <Node*> children = _bg->getChildren();
	int size = children.size();
	for (int i = 1; i<=24; ++i) {
		

		std::ostringstream nodeName;
		nodeName.clear();
		nodeName <<i;
		std::string nodeStr = nodeName.str();

		Node * monsterItem = _bg->getChildByName(nodeStr);

		Vec2 nodePos = monsterItem->getPosition();

		int animalPicker = RandomHelper::random_int(1, 6);


		if (_menuContext->getCurrentLevel() == animalPicker) {
			_answerValue++;
		}


		Node *animal = CSLoader::createNode("spot/" + animalsName[animalPicker] +".csb");

		//questionPlate->setContentSize(Size(visibleSize.width * numberOfPages, visibleSize.height * 0.1));
		animal->setAnchorPoint(Vec2(0.5, 0.5));
		animal->setPosition(nodePos);

		_scrollView->addChild(animal,15);
		//std::string str = monsterItem->getName().c_str();
		//CCLOG("name : %s", str.c_str());
	}
	

}


bool spot::onTouchBegan(Touch* touch, Event* event) {


	auto target = event->getCurrentTarget();
	Point locationInNode = Vec2(0, 0);

	locationInNode = target->getParent()->getParent()->convertToNodeSpace(touch->getLocation());
	


	auto bb = target->getBoundingBox();

	if (bb.containsPoint(locationInNode)) {

		CCLOG("touched");
	

		if (target->getName() == "cal") {

			_calculator->resetCalculator();

			if (_calculatorTouched == false) {
				_calculator->setVisible(true);
				_calculatorTouched = true;

			}
			else {

				_calculator->setVisible(false);
				_calculatorTouched = false;
			}

		}


		return true; // to indicate that we have consumed it.
	}
	return false; // to indicate that we have not consumed it.
}

