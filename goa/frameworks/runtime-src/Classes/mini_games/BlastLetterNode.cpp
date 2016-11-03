
#include "BlastLetterNode.h"
#include "CarDraw.h"
#include "../WordSceneLipiTKNode.h"

USING_NS_CC;


BlastLetterNode::BlastLetterNode()
{
}

BlastLetterNode::~BlastLetterNode()
{

}

cocos2d::Sprite * BlastLetterNode::createDrawingBoard()
{
	Size visibleSize = Director::getInstance()->getVisibleSize();
	auto drawingBoardSprite = Sprite::create();
	drawingBoardSprite->setTextureRect(Rect(0, 0, _canvasWidth, _canvasHeight));
	drawingBoardSprite->setColor(Color3B::BLACK);
	drawingBoardSprite->setOpacity(50);
	return drawingBoardSprite;
}

BlastLetterNode * BlastLetterNode::create(int width, int height, cocos2d::Point position)
{
	BlastLetterNode* wordSceneLipiTKNode = new (std::nothrow) BlastLetterNode();
	if (wordSceneLipiTKNode && wordSceneLipiTKNode->initialize(width, height, position))
	{
		wordSceneLipiTKNode->autorelease();
		wordSceneLipiTKNode->setPosition(position);
		return wordSceneLipiTKNode;
	}
	CC_SAFE_DELETE(wordSceneLipiTKNode);
	return nullptr;
}

void BlastLetterNode::draw(cocos2d::DrawNode * paintingNode, cocos2d::Point fromPoint, cocos2d::Point currentPoint)
{
	paintingNode->drawSegment(fromPoint, currentPoint, 50, Color4F(0 / 255.0f, 0 / 255.0f, 0 / 255.0f, 1.0f));
	//paintingNode->drawSegment(fromPoint, currentPoint, 5, Color4F(255 / 255.0f, 255 / 255.0f, 255 / 255.0f, 1.0f));
}

void BlastLetterNode::broadCastRecognizedChars(std::vector<std::string> results)
{
	CCLOG("car draw = %s", results.at(0).c_str());
	_result = results;
}

std::vector<std::string> BlastLetterNode::getPosibileCharacter()
{
	return _result;
}

