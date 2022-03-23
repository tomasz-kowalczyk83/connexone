import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import axios from "axios";

import Timer from './Timer'

let container = null;

jest.mock("axios");

beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement('div');
    document.body.appendChild(container);
    jest.useFakeTimers();
});

afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(container);
    container.remove();
    container = null;
    jest.useRealTimers();
});

it("renders server epoch time", async () => {
    axios.get.mockResolvedValueOnce({ data: { epoch: 5 } });

    await act(async () => {
        render(<Timer />, container);
    });

    //epoch * 1000
    expect(container.querySelector("p:first-child").textContent).toContain(new Date(5000).toLocaleTimeString());
})
it('renders client time', async () => {
    axios.get.mockResolvedValue({ data: { epoch: 5 } });
    const now = new Date()
    
    await act(async () => {
        render(<Timer />, container);
    });

    expect(container.querySelector("p:nth-of-type(2)").textContent).toContain(now.toLocaleTimeString());

    await act(async () => {
        jest.advanceTimersByTime(3000);
        now.setSeconds(now.getSeconds() + 3)
    });

    expect(container.querySelector("p:nth-of-type(2)").textContent).toContain(now.toLocaleTimeString());
})
it('renders difference between client and server time', async () => {   
    axios.get.mockResolvedValue({ data: { epoch: Date.now() / 1000 } });
    
    // Use the asynchronous version of act to apply resolved promises
    await act(async () => {
        render(<Timer />, container);
    });

    await act(async () => {
        jest.advanceTimersByTime(2000);
    });

    //cannot figure out why the difference is not rendering correctly under test?
    expect(container.querySelector("p:nth-of-type(3)").textContent).toContain('00:00:02');
})
it('fetches server time every 30 seconds', async () => {
    axios.get.mockResolvedValue({ data: { epoch: 5 } });

    await act(async () => {
        render(<Timer />, container);
    });

    //we wait for 31 secs for api call to happen twice, initially and after 30 seconds,
    expect(axios.get.mock.calls.length).toBe(1) 
    
    await act(async () => {
        jest.advanceTimersByTime(31000);
    });

    expect(axios.get.mock.calls.length).toBe(2)
});
it('set loading state when fetching data from server', async () => {
    // delay response from server so we can check if loading state is set
    axios.get.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ data: { epoch: 5 } }), 1000)));

    await act(async () => {
        render(<Timer />, container);
    });

    expect(container.getElementsByClassName('timer loading').length).toBe(1);

    // wait for axios to resolve so it sets loading state back to false
    await act(async () => {
        jest.advanceTimersByTime(3000);
    });
    
    expect(container.getElementsByClassName('timer loading').length).toBe(0);
});