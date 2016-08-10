#include "BajaWordScene.h"
#include "editor-support/cocostudio/CocoStudio.h"

USING_NS_CC;

Scene* BajaWordScene::createScene() {
	auto layer = BajaWordScene::create();
	auto scene = GameScene::createWithChild(layer, "BajaWordScene");
	layer->_menuContext = scene->getMenuContext();
	return scene;
}

Node* BajaWordScene::loadNode() {

	Size visibleSize = Director::getInstance()->getVisibleSize();
	Vec2 origin = Director::getInstance()->getVisibleOrigin();

	auto node = CSLoader::createNode("baja/bajawordpanel.csb");
	node->setPosition(Vec2(visibleSize.width / 2 + origin.x, visibleSize.height / 2 + origin.y));
	node->setAnchorPoint(Vec2(0.5, 0.5));
	
	auto _fuelBar = (cocos2d::ui::LoadingBar*)(node->getChildByName("LoadingBar"));
	_fuelBar->setPercent(0);

	return node;
}

void BajaWordScene::createAnswer() {

	Size _size = Director::getInstance()->getVisibleSize();

	auto label = ui::Text::create();
	label->setString(_word);
	label->setFontSize(200);
	label->setFontName("fonts/arial.ttf");
	label->setTextColor(Color4B::RED);
	_answer = Node::create();
	_answer->addChild(label);
	_answer->setPosition(Vec2(_size.width / 2, _size.height * 92 / 100));
	addChild(_answer);

}

void BajaWordScene::createChoice() {
	float wid = Director::getInstance()->getVisibleSize().width;
	float hei = Director::getInstance()->getVisibleSize().height;

	_choice = Node::create();
	_choice->setPosition(Vec2(0, hei * 63 / 100));
	addChild(_choice);

	const float squareWidth = 1800 / _numGraphemes;

	for (int i = 0; i < _numGraphemes; i++) {
		auto fuelPouch = Sprite::createWithSpriteFrameName("baja/bajawdp.png");
		fuelPouch->setPosition(Vec2((i + 0.5) * squareWidth + wid*0.147, hei * -10 / 100));
		addChoice(fuelPouch);
	}
}

std::string BajaWordScene::getGridBackground() {
	return "baja/bajawdp.png";
}

std::string BajaWordScene::getGraphemeUnselectedBackground() {

	return "baja/bajawd.png";
}

std::string BajaWordScene::getGraphemeSelectedBackground() {
	return "baja/bajawd.png";
}

int BajaWordScene::getGridHeight() {
	return 800;
}

BajaWordScene* BajaWordScene::create() {
	BajaWordScene* word = new (std::nothrow) BajaWordScene();
	if (word && word->init())
	{
		word->autorelease();
		return word;
	}
	CC_SAFE_DELETE(word);
	return nullptr;
}

