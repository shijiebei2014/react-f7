import React, {Component, PropTypes} from 'react';
import {store as lineStore} from '../../redux/stores/line';
import {Page, Navbar, ContentBlockTitle, List, ListItem, FormLabel, FormInput, Button, GridCol, GridRow, ContentBlock, ButtonsSegmented} from 'framework7-react';
// import {showAlert} from 'framework7-redux'
import * as util from 'util';
const onChangeHandler = (event) => {
    console.log('change');
};


export class Line extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            // birthDate: '2014-04-30',
            // radioSelected: 1
        };        
    }
    
    render() {
        let {lines} = lineStore.getState();
        let items = [];
        let detail = (stops, stop_id, _direction, _name) => {
            let stop = stops[Number(stop_id) - 1]

            fetch(`/search_stop?name=${_name}&direction=${_direction + '' == true + '' ? 0 : 1}&stopid=${stop_id}`, {
                method: 'GET',
            }).then((res)=>res.json()).then((data) => {
                if (util.isArray(data.cars) && data.cars.length > 0) {
                    var info = data.cars[0]
                    // window.myApp.addNotification({
                    //     title: 'awesome',
                    //     message: `${info.terminal}, 还有约${Math.floor(info.time / 60)}分钟`
                    // });
                    const f7Context = this.context.framework7AppContext;
                    f7Context.getFramework7((f7) => {
                        f7.addNotification({
                            title: 'Awesome',
                            message: `${info.terminal}距<span style="color: red;">${stop.zdmc}</span>,<br> 还有约<span style="color: red;">${Math.floor(info.time / 60)}</span>分钟`
                        })
                    })
                } else {
                    console.log('123')
                }
                console.log(data)
            }).catch((err) => {
                alert(err)
            })
        }
        
        if (lines.lineResults0) {
            let {lineResults0, lineResults1, name} = lines;
            let d , r;
            if (lineResults0.direction + '' == 'true') {
                d = lineResults0.stops;
                if (lineResults1) {
                    r = lineResults1.stops;
                }
            } else {
                d = lineResults1.stops;
                if (lineResults0) {
                    r = lineResults0.stops;
                }
            }
            items = d.map((stop, index)=> {
                // detail.bind(this, d, stop.id, lineResults0.direaction, name)
                return <ListItem key={stop.id} title={stop.zdmc} subtitle="" media={stop.id} onClick={detail.bind(this, d, stop.id, lineResults0.direction, name)}></ListItem>
            })
            console.log(items.length)
            items.splice(0, 0, <ListItem key={0} title={`${d[0].zdmc}~${d[d.length - 1].zdmc}`} subtitle="" after="交换" onClick={() => lineStore.dispatch({type: 'switch'})}></ListItem>)
            // console.log(items)
        }
        return (
            <Page id="line" page cached>
                <List mediaList>
                    {items}
                </List>
            </Page>
        )
    }
};

Line.contextTypes = {
	framework7AppContext: PropTypes.object
};
