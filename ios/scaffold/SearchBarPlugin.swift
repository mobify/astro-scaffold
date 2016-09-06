//
//  SearchBarPlugin.swift
//
//  Created by Anton Bielousov on 2015-08-21.
//  Copyright (c) 2015 Mobify. All rights reserved.
//

import Foundation
import UIKit
import Astro

class SearchBarViewController: UIViewController {
    let containerView = UIView()
    let containerIconTextField = UIView()
    let searchTextField = UITextField()
    let searchCancelButton = UIButton()
    // This a button so that we can use it to focus the input field
    // and bring the keyboard up if it is tapped (since it appears as part
    // of the text field)
    let searchIconButton = UIButton()
    
    weak var delegate: SearchBarViewControllerProtocol?
    
    init() {
        super.init(nibName: nil, bundle: nil)
        
        view.translatesAutoresizingMaskIntoConstraints = false
        containerView.translatesAutoresizingMaskIntoConstraints = false
        containerIconTextField.translatesAutoresizingMaskIntoConstraints = false
        searchTextField.translatesAutoresizingMaskIntoConstraints = false
        searchCancelButton.translatesAutoresizingMaskIntoConstraints = false
        searchIconButton.translatesAutoresizingMaskIntoConstraints = false
        
        let barHeight = view.frame.size.height
        searchIconButton.frame = CGRectMake(0, 0, barHeight, barHeight)

        styleContainer()
        styleContainerIconTextField()
        styleSearchIconButton("icon__search")
        styleSearchTextField()
        styleSearchCancelButton()
        setLocalizedText()
        
        bindSearchEvents()
        
        containerIconTextField.addSubview(searchIconButton)
        containerIconTextField.addSubview(searchTextField)
        containerView.addSubview(containerIconTextField)
        containerView.addSubview(searchCancelButton)
        view.addSubview(containerView)
        
        let views = [
            "containerView": containerView,
            "containerIconTextField": containerIconTextField,
            "searchTextField": searchTextField,
            "searchCancelButton": searchCancelButton,
            "searchIconView": searchIconButton
        ]
        
        containerView.addConstraints(NSLayoutConstraint.constraintsWithVisualFormat("V:|-10-[containerIconTextField]-10-|", options: [], metrics: nil, views: views))
        containerView.addConstraints(NSLayoutConstraint.constraintsWithVisualFormat("H:|-10-[containerIconTextField][searchCancelButton(==80)]|", options: [], metrics: nil, views: views))
        containerView.addConstraints(NSLayoutConstraint.constraintsWithVisualFormat("V:|[searchCancelButton]|", options: [], metrics: nil, views: views))
        containerView.addConstraints(NSLayoutConstraint.constraintsWithVisualFormat("V:|[searchIconView(==44)]|", options: [], metrics: nil, views: views))
        containerIconTextField.addConstraints(NSLayoutConstraint.constraintsWithVisualFormat("H:|[searchIconView(==44)][searchTextField(>=100)]|", options: [], metrics: nil, views: views))
        containerView.addConstraints(NSLayoutConstraint.constraintsWithVisualFormat("V:|[searchTextField]|", options: [], metrics: nil, views: views))
        view.addConstraints(NSLayoutConstraint.constraintsWithVisualFormat("V:|-0.5-[containerView]-0.5-|", options: [], metrics: nil, views: views))
        view.addConstraints(NSLayoutConstraint.constraintsWithVisualFormat("H:|[containerView]|", options: [], metrics: nil, views: views))
    }
    
    func styleContainerIconTextField() {
        containerIconTextField.layer.cornerRadius = 5;
        containerIconTextField.layer.masksToBounds = true;
        containerIconTextField.layer.borderWidth = 1;
        containerIconTextField.layer.borderColor = AppColours.grey_70.CGColor
        containerIconTextField.backgroundColor = UIColor.whiteColor()
    }
    
    func styleSearchIconButton(name: String) {
        let icon = UIImage(named: name)?.imageWithRenderingMode(UIImageRenderingMode.AlwaysTemplate)
        searchIconButton.setImage(icon, forState: UIControlState.Normal)
        searchIconButton.adjustsImageWhenHighlighted = false
        searchIconButton.contentMode = UIViewContentMode.Center
        searchIconButton.backgroundColor = UIColor.whiteColor()
        searchIconButton.tintColor = AppColours.blueLinkText
    }
    
    func styleContainer() {
        let layer = containerView.layer
        containerView.backgroundColor = AppColours.grey_95
        
        // Add shadow
        layer.shadowColor = UIColor.blackColor().CGColor
        layer.shadowOffset = CGSize(width: 0, height: 3)
        layer.shadowOpacity = 0.1
        layer.shadowRadius = 3
    }
    
    func styleSearchTextField() {
        searchTextField.clearButtonMode = UITextFieldViewMode.Always;
        searchTextField.keyboardType = UIKeyboardType.WebSearch;
        searchTextField.backgroundColor = UIColor.whiteColor()
        searchTextField.textColor = AppColours.blackText
    }

    func styleSearchCancelButton() {
        searchCancelButton.backgroundColor = AppColours.grey_95
        searchCancelButton.setTitleColor(AppColours.blueLinkText, forState: UIControlState.Normal)
    }

    func setLocalizedText() {
        let hintText = Localization.translate("search_bar_hint")
        searchTextField.attributedPlaceholder = NSAttributedString(string: hintText, attributes: [NSForegroundColorAttributeName: AppColours.grey_70])
        searchCancelButton.setTitle(Localization.translate("search_bar_cancel"), forState: UIControlState.Normal)
    }
    
    func bindSearchEvents() {
        searchTextField.addTarget(self, action: #selector(searchTextFieldShouldReturn), forControlEvents: UIControlEvents.EditingDidEndOnExit)
        searchIconButton.addTarget(self, action: #selector(searchTextFieldShouldFocus), forControlEvents: UIControlEvents.TouchUpInside)
        searchCancelButton.addTarget(self, action: #selector(searchShouldCancel), forControlEvents: UIControlEvents.TouchUpInside)
    }
    
    func searchTextFieldShouldFocus() {
        delegate?.focusRequested()
    }
    
    func searchShouldCancel() {
        delegate?.searchCanceled()
    }
    
    func searchTextFieldShouldReturn(sender: UITextField) {
        let text = sender.text ?? ""
        delegate?.searchSubmitted(text)
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}

protocol SearchBarViewControllerProtocol: class {
    func focusRequested()
    func searchCanceled()
    func searchSubmitted(text: String)
}

public class SearchBarPlugin: Plugin, ViewPlugin, SearchBarViewControllerProtocol, LocaleChangedListener {
    let typedViewController = SearchBarViewController()
    
    public var viewController: UIViewController {
        return typedViewController
    }
    
    public required init(address: MessageAddress, messageBus: MessageBus, pluginResolver: PluginResolver, options: JsonObject?) {
        super.init(address: address, messageBus: messageBus, pluginResolver: pluginResolver, options: options)
        
        self.addRpcMethodShim("blur") { params, respond in
            ////////// This will be autogenerated at some point //////////
            self.blur(respond)
            /////////////////////////////////////////////////////////////
        }
        
        self.addRpcMethodShim("focus") { params, respond in
            ////////// This will be autogenerated at some point //////////
            self.focus(respond)
            /////////////////////////////////////////////////////////////
        }
        
        self.addRpcMethodShim("setText") { params, respond in
            ////////// This will be autogenerated at some point //////////
            if let text: String = MethodShimUtils.getArg(params, key: "text", respond: respond) {
                self.setText(text, respond: respond)
            }
            /////////////////////////////////////////////////////////////
        }

        Localization.addLocaleChangedListener(self)
        typedViewController.delegate = self
    }
    
    func blur(respond: RpcMethodCallback) {
        typedViewController.searchTextField.endEditing(true)
    }
    
    func focus(respond: RpcMethodCallback) {
        focusRequested()
    }
    
    func setText(text: String, respond: RpcMethodCallback) {
        typedViewController.searchTextField.text = text
    }
    
    func focusRequested() {
        typedViewController.searchTextField.becomeFirstResponder()
    }
    
    func searchCanceled() {
        trigger("search:cancelled")
        
        // hide keyboard
        typedViewController.searchTextField.endEditing(true)
    }
    
    func searchSubmitted(searchText: String) {
        trigger("search:submitted", params:["searchTerms": searchText])
    }

    public func localeDidChange() {
        typedViewController.setLocalizedText()
    }
}