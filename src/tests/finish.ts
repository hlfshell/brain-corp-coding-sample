/*
What is this? It's a helper stub.

Async await causes some screwiness with node-mocks-http
and I didn't like the other mocking libraries. Now is a bad
time to work with something you're not familiar with. I suspect
sinon would have been the better mock but I'm not as familiar
with that to use it here given the time limit.

The tldr is thati t will check to see if the res.end() or
res.send() was called on the response, checking everything tenth
of a second. This deals with the async nature of the response
without having to do anything fancy.
*/

export function finish(response : any, maxTries : number = 15){
    return new Promise((resolve, reject)=>{
        let timesFired = 0;

        let responseCheck = ()=>{
            timesFired++;
            if(timesFired >= maxTries) return reject("Response never ended");
            response.finished ? resolve() :
                setTimeout(()=> responseCheck(), 100);
        }
        responseCheck();
    });
}
