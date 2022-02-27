import React from 'react'
import { withRouter, Link } from 'react-router-dom';
import AuthUtil from '../auth/AuthUtil';
import { Accordion, AccordionTab } from 'primereact/accordion';
import '../App.css';
class SideBarComponent extends React.Component {
    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }

    render() {
        let menuList = AuthUtil.getMenu();
        let groupsList = [];
        let groupWiseMenuList = [];

        for (let i in menuList) {
            if (groupsList.indexOf(menuList[i].groupName) === -1) {
                groupsList.push(menuList[i].groupName);
            }
        }

        for (let g in groupsList) {
            let tmp = {
                id: g,
                groupName: groupsList[g],
                menu: []
            }
            for (let m in menuList) {
                if (menuList[m].groupName === groupsList[g]) {
                    tmp.menu.push(menuList[m]);
                }
            }
            groupWiseMenuList.push(tmp);
            tmp = {};
        }

        return (
            <div className="sidenav">
                <div className="navbar-content" key={800}>
                    <div className="mydiv" key={900}>
                        {AuthUtil.isTokenValid() &&
                            <Link
                                to={{
                                    pathname: "/home",
                                }}
                            >
                                Home
                            </Link>
                        }
                    </div>
                </div>

                {groupWiseMenuList && groupWiseMenuList.map((value, index) => {
                    return (
                        <div key={index + 1001}>
                            <div className="navbar-content" key={index + 100}>
                                {value.groupName !== "Default" && <Accordion multiple activeIndex={Array.from(Array(groupWiseMenuList.length).keys())}>
                                    <AccordionTab header={value.groupName} key={index + 200}>

                                        {value.menu && value.menu.map((item, index) => {
                                            return (
                                                <div className="mydiv" key={index + 300}>
                                                    <Link
                                                        to={{
                                                            pathname: item.route,
                                                        }}
                                                    >
                                                        {item.label}

                                                    </Link>
                                                </div>)
                                        })
                                        }
                                    </AccordionTab>
                                </Accordion>}
                            </div>

                            {value.groupName === "Default" && value.menu.map((item, index) => {
                                return (
                                    <div className="navbar-content" key={index + 400}>
                                        <div className="mydiv" key={index + 500}>
                                            <Link
                                                to={{
                                                    pathname: item.route,
                                                }}
                                            >
                                                {item.label}

                                            </Link>
                                        </div>
                                    </div>)
                            })
                            }

                        </div>
                    );

                })
                }
            </div>
        );
    }
}

export default withRouter(SideBarComponent);