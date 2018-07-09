import React, {PropTypes} from 'react';
import {store as lineStore, framework7StateKernel} from '../redux/stores/line';
import {
	Framework7App, Statusbar, Panel, View, Navbar, Pages, Page, ContentBlock, ContentBlockTitle, 
	List, ListItem, Views, NavLeft, Link, NavCenter, NavRight, GridRow, GridCol, Button, Popup,
	LoginScreen, LoginScreenTitle, ListButton, ListLabel, FormLabel, FormInput, navigateTo
} from 'framework7-react';
import * as assign from 'object-assign';
// import * as fetch from 'isomorphic-fetch';
import * as querystring from 'querystring';
import {routes} from '../routes';

const LeftPanel = (props, context) => (
	<Panel left reveal layout="dark">
		<View id="left-panel-view" navbarThrough dynamicNavbar="true">
			{context.framework7AppContext.theme.ios ? <Navbar title="Left Panel"></Navbar> : null}
			<Pages>
				<Page>
					{context.framework7AppContext.theme.material ? <Navbar title="Left Panel"></Navbar> : null}
					<ContentBlock inner>
						<p>Left panel content goes here</p>
					</ContentBlock>
					<ContentBlockTitle>Load page in panel</ContentBlockTitle>
					<List>
						<ListItem link="/about/" title="About"></ListItem>
						<ListItem link="/form/" title="Form"></ListItem>
					</List>
					<ContentBlockTitle>Load page in main view</ContentBlockTitle>
					<List>
						<ListItem link="/about/" title="About" linkView="#main-view" linkClosePanel></ListItem>
						<ListItem link="/form/" title="Form" linkView="#main-view" linkClosePanel></ListItem>
					</List>
				</Page>
			</Pages>
		</View>
	</Panel>
);

LeftPanel.contextTypes = {
	framework7AppContext: PropTypes.object
};

const MainViews = (props, context) => {
	const f7Context = context.framework7AppContext;
    let s = {
        width:'100%'
    }
    /*let handleSearch = (e) => {
        f7Context.getFramework7((f7) => {
            var formData = f7.formToData('#searchForm');
            var text = formData.bus_name;
            if (text == "") {
                return false;
            }
            var regExp = /^\d+(\.\d+)?$/;
            if (regExp.test(text)) {
                text = text + '路';
            }
			fetch(`/search?${querystring.stringify({name: text})}`, {
              method: 'GET',
              headers:{
                accept: 'application/json',
              }
			}).then(function(res) {
				return res.json()
			}).then(function(obj) {
				lineStore.dispatch({
					type: 'query',
					payload: assign(obj, {
						name: text
					})
				})
				f7.mainView.router.loadPage('/line/')
			}).catch(function(err) {
				console.log(err)
			})
        });
    }*/
	let handleSearch = function(e) {
		return function (dispatch) {
			f7Context.getFramework7((f7) => {
				var formData = f7.formToData('#searchForm');
				var text = formData.bus_name;
				if (text == "") {
					return false;
				}
				var regExp = /^\d+(\.\d+)?$/;
				if (regExp.test(text)) {
					text = text + '路';
				}
				fetch(`/search?${querystring.stringify({name: text})}`, {
					method: 'GET',
					headers:{
						accept: 'application/json',
					}
				}).then((res) => res.json()).then(function(obj) {
					dispatch({
						type: 'query',
						payload: assign(obj, {
							name: text
						})
					})
					f7.mainView.router.loadPage('/line/')
				}).catch(function(err) {
					console.log(err)
					fetch(`/search_bus_api?${querystring.stringify({name: text})}`, {
						method: 'GET',
						headers:{
							accept: 'application/json',
						}
					}).then((res) => res.json()).then(function(obj) {
						dispatch({
							type: 'query',
							payload: assign(obj, {
								name: text
							})
						})
						f7.mainView.router.loadPage('/line/')
					}).catch(function(err) {
						console.log(err)
					})
				})
			});
		};
	}
	return (
		<Views>
			<View id="main-view" navbarThrough dynamicNavbar={true} main url="/">
				<Navbar>
					<NavLeft>
						<Link icon="icon-back" href="#" onClick={() => f7Context.getFramework7((f7) => {
							f7.mainView.router.back()
						})}/>
					</NavLeft>
					<NavCenter sliding>Awesome 公交</NavCenter>
					<NavRight>
						<Link icon="icon-bars" openPanel="right"></Link>
					</NavRight>
				</Navbar>
				<Pages>
					<Page>
                        <List form id="searchForm">
                            <ListItem>
                                <FormInput type="text" name="bus_name" placeholder="请输入完整的线路名称，如“933路”、“46路区间"/>
                            </ListItem>
                        </List>
                        <List>
                            <ListButton title="查询" style={s} onClick={(e) => {
								lineStore.dispatch(handleSearch(e))
							}} />
                        </List>
					</Page>
				</Pages>
			</View>
		</Views>
	);
};

MainViews.contextTypes = {
	framework7AppContext: PropTypes.object
};

export const App = () => (	
	//Change themeType to "material" to use the Material theme
	<Framework7App themeType="ios" routes={routes} stateKernel={framework7StateKernel}>		
		<LeftPanel />
		<MainViews />
	</Framework7App>  
);
