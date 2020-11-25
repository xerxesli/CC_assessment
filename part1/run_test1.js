'use strict';

const https = require('https')
const querystring = require('querystring')

function check_result(test_case_id, status_code, body, expected_status_code, check_result_json)
{
    var ret = false
    // Check status code
    if ( status_code != expected_status_code )
    {
        console.log(`Status code ${status_code} error, expect ${expected_status_code}`)
    }
    // Check body
    if (body == check_result_json)
    {
        ret = true
    }
    else{
        ret = false
    }

    if( false == ret )
    {
        console.log("[check_result]")
        console.log("status code="+status_code+",expect status code="+expected_status_code)
        console.log("resp body=" + body)
        console.log("expect body=" + check_result_json)
        console.log(`Test case ${test_case_id} result: <FAIL>\n`)
    }
    else
    {
        console.log(`Test case ${test_case_id} result: <PASS>\n`)
    }
    return ret
}

function process_post_request(test_case_id, host, path, post_data, expected_status_code, check_result_json)
{
    const options = {
        hostname: host,
        path: path,
        method: "POST",
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(post_data)
        }
    }

    var req = https.request(options, res =>{
        let body = ""
        var status_code = res.statusCode
        res.setEncoding('utf8');
        res.on('data', function(d) {
            body += d;
        });
        res.on('end', function() {
            check_result(test_case_id, status_code, body, expected_status_code, check_result_json)
        });
    })

    req.on('error', error => {
        console.error(error)
        console.log("err code="+error.statusCode)
    })
    req.write(post_data);
    req.end()
}

function process_get_request(test_case_id, host, path, expected_status_code, check_result_json)
{
    let body = ""
    let status_code = 0
    const options = {
        hostname: host,
        path: path,
        method: 'GET'
    }

    var req = https.request(options, res =>{
        //console.log('Status Code:', res.statusCode);
        status_code = res.statusCode
        res.setEncoding('utf8');
        res.on('data', function(d) {
            body += d;
        });
        res.on('end', function() {
            check_result(test_case_id, status_code, body, expected_status_code, check_result_json)
            //var parsed = JSON.parse(body);
            //console.log('BODY: ' + body);
        });
    })

    req.on('error', error => {
        console.error(error)
        console.log("err code="+error.statusCode)
    })

    req.end()

}

function test_get_user(user_name)
{
    var host = "petstore.swagger.io"
    var path = "/v2/user/"+user_name
    var expected_status_code = 200
    var check_result_json = JSON.stringify(
        {
        "id": 5566,
        "username": "John",
        "firstName": "John",
        "lastName": "Wick",
        "email": "ar15@hotmail.com",
        "password": "dog",
        "phone": "0806449",
        "userStatus": 0
    }
    );
    process_get_request(host, path, expected_status_code, check_result_json)
}

function test_find_pet_by_id(pet_id)
{
    var test_case_id = "TEST_000001"
    var host = "petstore.swagger.io"
    var path = "/v2/pet/"+pet_id
    var expected_status_code = 200
    var check_result_json = JSON.stringify(
        {
            "id": 12,
            "category": {
              "id": 0,
              "name": "dogs"
            },
            "name": "Fido",
            "photoUrls": [
              "string"
            ],
            "tags": [
              {
                "id": 0,
                "name": "string"
              }
            ],
            "status": "sold"
          }
    );
    process_get_request(test_case_id, host, path, expected_status_code, check_result_json)
}

function test_create_user(user_name)
{
    var test_case_id = "TEST_000101"
    const post_data = JSON.stringify(
    {
        "id": 5566,
        "username": user_name,
        "firstName": "John",
        "lastName": "Wick",
        "email": "ar15@hotmail.com",
        "password": "dog",
        "phone": "0806449",
        "userStatus": 0
    }
    );
    var host = "petstore.swagger.io"
    var path = "/v2/user"
    var expected_status_code = 200
    var check_result_json = JSON.stringify(
    {
            "code":200,
            "type":"unknown",
            "message":"5566"
    }
    );
    process_post_request(test_case_id, host, path, post_data, expected_status_code, check_result_json)
}

function main()
{
    test_find_pet_by_id(12)
    test_create_user("John")
}

main()