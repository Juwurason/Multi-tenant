import React, { useEffect, useState } from 'react';
import { Route, useHistory, withRouter } from 'react-router-dom';
import routerService from '../../router_service';
import Header from './header.jsx';
import SidebarContent from './sidebar';

const DefaultLayout = (props) => {
	const navigate = useHistory();
	const [menu, setMenu] = useState(false);

	const toggleMobileMenu = () => {
		setMenu(!menu);
	};

	useEffect(() => {
		const user = JSON.parse(localStorage.getItem('user'));
		if (!user || !user.token || user.role !== "CompanyAdmin") {
			navigate.push('/');
		}
	}, [localStorage.getItem('user')]);

	const handleLogout = () => {
		localStorage.removeItem('user');
		navigate.push('/');
	};

	const { match } = props;

	return (
		<>
			<div className={`main-wrapper ${menu ? 'slide-nav' : ''}`}>
				<Header onMenuClick={(value) => toggleMobileMenu()} onLogout={() => handleLogout()} />
				<div>
					{routerService.map((route, key) => (
						<Route key={key} path={`${match.url}/${route.path}`} component={route.component} />
					))}
				</div>
				<SidebarContent onMenuClick={(value) => toggleMobileMenu()} />
			</div>
		</>
	);
};

export default withRouter(DefaultLayout);
