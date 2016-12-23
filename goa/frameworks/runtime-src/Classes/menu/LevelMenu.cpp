//
//  LevelMenu.cpp
//  goa
//
//  Created by Srikanth Talapadi on 22/12/2016.
//
//

#include "LevelMenu.h"
#include "MenuContext.h"
#include "storage/local-storage/LocalStorage.h"
#include "external/json/document.h"
#include "external/json/stringbuffer.h"
#include "external/json/writer.h"
#include "../lang/LangUtil.h"
#include "editor-support/cocostudio/CocoStudio.h"

USING_NS_CC;

Scene *LevelMenu::createScene(std::string gameName) {
    auto layer = LevelMenu::create(gameName);
    auto scene = Scene::create();
    scene->addChild(layer);
    return scene;
    
}

LevelMenu *LevelMenu::create(std::string gameName) {
    LevelMenu* lhs = new (std::nothrow) LevelMenu();
    if(lhs && lhs->initWithGame(gameName))
    {
        lhs->autorelease();
        return lhs;
    }
    CC_SAFE_DELETE(lhs);
    return nullptr;
    
}

std::map<std::string, std::string> LevelMenu::parseGameConfigToMap(std::string gameName) {
    std::string gameConfigStr;
    localStorageGetItem(gameName, &gameConfigStr);
    rapidjson::Document gameConfig;
    std::map<std::string, std::string> returnMap;
    if (false == gameConfig.Parse<0>(gameConfigStr.c_str()).HasParseError()) {
        // document is ok
        returnMap["name"] = gameConfig["name"].GetString();
        returnMap["cIcon"] = gameConfig["cIcon"].GetString();
        returnMap["icon"] = gameConfig["icon"].GetString();
        returnMap["span"] = gameConfig["span"].GetInt();
        returnMap["numLevels"] = gameConfig["numLevels"].GetInt();
        returnMap["backgroundJson"] = gameConfig["backgroundJson"].GetString();
        returnMap["maingroundJson"] = gameConfig["maingroundJson"].GetString();
        returnMap["foregroundJson"] = gameConfig["foregroundJson"].GetString();
        returnMap["frontgroundJson"] = gameConfig["frontgroundJson"].GetString();
        returnMap["title"] = LangUtil::getInstance()->translateString(gameConfig["title"].GetString());
    }else{
        // error
    }
    return returnMap;
}


LevelMenu::LevelMenu() {
    
}

LevelMenu::~LevelMenu() {
    
}

bool LevelMenu::initWithGame(std::string gameName) {
    if(!Node::init()) {
        return false;
    }
    _gameName = gameName;
    std::string gameConfigStr;
    localStorageGetItem(gameName, &gameConfigStr);
    rapidjson::Document gameConfig;
    _parallax = ParallaxNode::create();
    Size visibleSize = Director::getInstance()->getVisibleSize();
    if (false == gameConfig.Parse<0>(gameConfigStr.c_str()).HasParseError()) {
        auto spanStr = gameConfig["span"].GetString();
        auto span = std::atoi(spanStr);
        auto numLevelsStr = gameConfig["numLevels"].GetString();
        auto numLevels = std::atoi(numLevelsStr);
        _parallax->setContentSize(Size(visibleSize.width * span, visibleSize.height));
        addChild(_parallax);
        if(gameConfig.HasMember("backgroundJson")) {
            auto backgroundJson = std::string(gameConfig["backgroundJson"].GetString());
            backgroundJson.replace(backgroundJson.size() - 4, std::string::npos, "csb");
            auto node = CSLoader::createNode(backgroundJson);
            _parallax->addChild(node, -4, Vec2(0.2, 0.2), Vec2::ZERO);
        }
        if(gameConfig.HasMember("maingroundJson")) {
            auto maingroundJson = std::string(gameConfig["maingroundJson"].GetString());
            maingroundJson.replace(maingroundJson.size() - 4, std::string::npos, "csb");
            auto node = CSLoader::createNode(maingroundJson);
            _parallax->addChild(node, -3, Vec2(0.4, 0.4), Vec2::ZERO);
        }
        if(gameConfig.HasMember("foregroundJson")) {
            auto foregroundJson = std::string(gameConfig["foregroundJson"].GetString());
            foregroundJson.replace(foregroundJson.size() - 4, std::string::npos, "csb");
            auto node = CSLoader::createNode(foregroundJson);
            _parallax->addChild(node, -2, Vec2(0.6, 0.6), Vec2::ZERO);
        }
        if(gameConfig.HasMember("frontgroundJson")) {
            auto frontgroundJson = std::string(gameConfig["frontgroundJson"].GetString());
            frontgroundJson.replace(frontgroundJson.size() - 4, std::string::npos, "csb");
            auto node = CSLoader::createNode(frontgroundJson);
            _parallax->addChild(node, -1, Vec2(0.8, 0.8), Vec2::ZERO);
        }
        _scrollView = ui::ScrollView::create();
        _scrollView->setContentSize(visibleSize);
        _scrollView->setDirection(ui::ScrollView::Direction::HORIZONTAL);
        _scrollView->setInnerContainerSize(Size(visibleSize.width * span, visibleSize.height));
        addChild(_scrollView);
        _scrollView->addEventListener(CC_CALLBACK_2(LevelMenu::scrolled, this));
        
        std::string progressStr;
        localStorageGetItem(gameName + ".level", &progressStr);

        rapidjson::Document d;
        rapidjson::Document::AllocatorType& allocator = d.GetAllocator();
        if(progressStr.empty()) {
            d.SetArray();
            d.PushBack(0, allocator);
        } else {
            d.Parse(progressStr.c_str());
        }
        auto gap = visibleSize.width * span / (numLevels + 1);
        auto jump = -(visibleSize.height - 500) * span / numLevels;
        int changeDir = ceil((float) (numLevels + 1) / span);
        float vPos = 200;
        Vec2 prevPos = Vec2::ZERO;
        Vec2 newPos = Vec2::ZERO;
        SpriteFrameCache::getInstance()->addSpriteFramesWithFile("levelstep/levelstep.plist");
        for(int i = 1; i <= numLevels; i++) {
            ui::Button* but;
            if(i == d.Size()) {
                but = ui::Button::create("levelstep/present.png", "levelstep/present_pressed.png", "levelstep/present.png",ui::Widget::TextureResType::PLIST);
                but->addTouchEventListener(CC_CALLBACK_2(LevelMenu::startGame, this));
                auto mark = Sprite::createWithSpriteFrameName("levelstep/mark.png");
                mark->setPosition(300 / 2, 300 * 1.5);
                but->addChild(mark);
                _initPos = Vec2(-MAX(0, MIN(visibleSize.width * ( span - 1), gap * i - visibleSize.width / 2)), 0);
            } else if(i > d.Size()) {
                but = ui::Button::create("levelstep/disabled.png", "levelstep/disabled.png", "levelstep/disabled.png",ui::Widget::TextureResType::PLIST);
                but->setTouchEnabled(false);
            } else {
                but = ui::Button::create("levelstep/done.png", "levelstep/done_pressed.png", "levelstep/done.png",ui::Widget::TextureResType::PLIST);
                but->addTouchEventListener(CC_CALLBACK_2(LevelMenu::startGame, this));
                auto iStar = d[i].GetInt();
                auto star = iStar >= 1 ? Sprite::createWithSpriteFrameName("levelstep/star.png") : Sprite::createWithSpriteFrameName("levelstep/star_empty.png");
                star->setScale(0.8);
                star->setPosition(Vec2(300 / 4, 300 * 3 / 4 - 10));
                but->addChild(star);
                
                star = iStar >= 2 ? Sprite::createWithSpriteFrameName("levelstep/star.png") : Sprite::createWithSpriteFrameName("levelstep/star_empty.png");
                star->setScale(0.8);
                star->setPosition(Vec2(300 / 2, 300 * 7 / 8 - 10));
                but->addChild(star);
                
                star = iStar >= 1 ? Sprite::createWithSpriteFrameName("levelstep/star.png") : Sprite::createWithSpriteFrameName("levelstep/star_empty.png");
                star->setScale(0.8);
                star->setPosition(Vec2(300 * 3 / 4 - 10, 300 * 3 / 4 - 10));
                but->addChild(star);

            }
            newPos = Vec2(gap * i, vPos);
            but->setPosition(newPos);
//            auto label = Label::createWithTTF(std::to_string(i), "Arial", 128, Size::ZERO, TextHAlignment::CENTER, TextVAlignment::CENTER);
//            label->setPosition(Vec2(but->getContentSize().width / 2, but->getContentSize().height / 2));
//            but->addChild(label);
            but->setTitleText(std::to_string(i));
            but->setTitleFontSize(128.0);
            _scrollView->addChild(but, 2);
            if((i - 1) % changeDir == 0) {
                jump *= -1;
            }
            vPos += jump;
            if(!prevPos.isZero()) {
                auto line = DrawNode::create(80);
//                line->setLineWidth(40);
                line->drawLine(prevPos, newPos, Color4F(Color4B(0xFF, 0xA3, 0x64,0xFF)));
                _scrollView->addChild(line, 1);
            }
            prevPos = newPos;
        }
    }else{
        // error
    }
    return true;
}

void LevelMenu::scrolled(cocos2d::Ref *target, cocos2d::ui::ScrollView::EventType event) {
    _parallax->setPosition(_scrollView->getInnerContainerPosition());
}

void LevelMenu::onEnterTransitionDidFinish() {
    _scrollView->setInnerContainerPosition(_initPos);
}

void LevelMenu::startGame(cocos2d::Ref *pSender, cocos2d::ui::Widget::TouchEventType eEventType) {
    if (eEventType == cocos2d::ui::Widget::TouchEventType::ENDED) {
        auto but = static_cast<ui::Button *>(pSender);
        auto level = but->getTitleText();
        localStorageSetItem(_gameName + ".currentLevel", level);
        MenuContext::launchGameFromJS(_gameName);
    }
}
