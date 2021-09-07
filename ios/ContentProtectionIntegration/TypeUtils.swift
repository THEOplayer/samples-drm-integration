//
//  TypeUtils.swift
//  ContentProtectionIntegration
//
//  Copyright © 2020 THEOplayer. All rights reserved.
//

import Foundation

func fromUtf8StringToData(str: String) -> Data? {
    return str.data(using: .utf8)
}

func fromBase64StringToData(base64Encoded: String) -> Data? {
    return Data(base64Encoded: base64Encoded)
}

func fromDataToBase64String(data: Data?) -> String? {
    return data?.base64EncodedString()
}

func fromDataToUtf8String(data: Data) -> String? {
    return String(data: data, encoding: .utf8)
}
