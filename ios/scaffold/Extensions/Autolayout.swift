//
//  Autolayout.swift
//  scaffold
//
//  Created by Jeremy Wiebe on 2015-08-18.
//  Copyright (c) 2015 Mobify. All rights reserved.
//

import Foundation
import UIKit

extension UIView {

    func pinToSuperviewEdges() {
        pinToSuperviewEdgesHorizontally()
        pinToSuperviewEdgesVertically()
    }

    func pinToSuperviewEdgesHorizontally() {
        self.superview!.addConstraints(NSLayoutConstraint.constraintsWithVisualFormat("H:|[view]|", options: [], metrics: nil, views: ["view":self]))
    }

    func pinToSuperviewEdgesVertically() {
        self.superview!.addConstraints(NSLayoutConstraint.constraintsWithVisualFormat("V:|[view]|", options: [], metrics: nil, views: ["view":self]))
    }

    func centerInSuperview() {
        self.superview!.addConstraint(NSLayoutConstraint(item: self, attribute: .CenterX, relatedBy: .Equal, toItem: self.superview!, attribute: .CenterX, multiplier: 1.0, constant: 0))
        self.superview!.addConstraint(NSLayoutConstraint(item: self, attribute: .CenterY, relatedBy: .Equal, toItem: self.superview!, attribute: .CenterY, multiplier: 1.0, constant: 0))
    }

    func constrainToHeight(height: CGFloat) {
        self.addConstraint(NSLayoutConstraint(item: self, attribute: .Height, relatedBy: .Equal, toItem: nil, attribute: .NotAnAttribute, multiplier: 1.0, constant: height))
    }
}