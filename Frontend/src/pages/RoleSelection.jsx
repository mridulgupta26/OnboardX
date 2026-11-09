import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RoleSelection.css";

const roles = [
	{
		name: "Intern",
		detail: "Start your onboarding journey",
		icon: "IN",
		destination: "/intern-login",
		workspace: "Start Your Journey",
	},
	{
		name: "HR",
		detail: "People and onboarding operations",
		icon: "HR",
		destination: "/employee-login",
		workspace: "HR Workspace",
	},
	{
		name: "IT",
		detail: "Technology and access management",
		icon: "IT",
		destination: "/employee-login",
		workspace: "IT Access Portal",
	},
	{
		name: "Manager",
		detail: "Team and business operations",
		icon: "M",
		destination: "/employee-login",
		workspace: "Manager Workspace",
	},
];

const onboardingDetails = {
	welcome: {
		title: "Welcome Aboard",
		subtitle: "Jordan's first week at OnboardX",
		items: ["Meet your people", "Set up your profile", "Get your tools ready"],
		progress: "25%",
		status: "In progress",
	},
	profile: {
		title: "Profile Setup",
		subtitle: "A complete profile helps every team support Jordan from day one.",
		items: ["Photo Uploaded", "Documents Uploaded", "Profile Completed"],
		progress: "100%",
		status: "Complete",
	},
	documents: {
		title: "Document Verification",
		subtitle: "Identity and education documents are stored securely.",
		items: ["Aadhaar Verified", "PAN Verified", "Degree Uploaded"],
		progress: "100%",
		status: "Verified",
	},
	provisioning: {
		title: "IT Provisioning",
		subtitle: "Work-ready tools provisioned by the IT team.",
		items: ["Laptop Assigned", "Email Created", "VPN Enabled", "Access Granted"],
		progress: "98%",
		status: "Active",
	},
	access: {
		title: "Access Management",
		subtitle: "Role-based access is coordinated across teams and tools.",
		items: ["Workspace permissions synced", "Team groups assigned", "Security review complete"],
		progress: "98%",
		status: "Active",
	},
};

function RoleSelection() {
	const navigate = useNavigate();
	const [activeScene, setActiveScene] = useState(0);
	const [selectedRole, setSelectedRole] = useState(null);
	const [selectedWidget, setSelectedWidget] = useState(null);
	const [widgetClosing, setWidgetClosing] = useState(false);
	const widgetCloseTimer = useRef(null);
	const visualRef = useRef(null);
	const boardRef = useRef(null);
	const scenePausedRef = useRef(false);

	useEffect(() => {
		const sceneTimer = window.setInterval(() => {
			if (!scenePausedRef.current) setActiveScene((scene) => (scene + 1) % 4);
		}, 5200);

		return () => window.clearInterval(sceneTimer);
	}, []);

	useEffect(() => {
		if (!selectedRole) return undefined;

		const closeOnEscape = (event) => {
			if (event.key === "Escape") setSelectedRole(null);
		};

		window.addEventListener("keydown", closeOnEscape);
		return () => window.removeEventListener("keydown", closeOnEscape);
	}, [selectedRole]);

	useEffect(() => () => window.clearTimeout(widgetCloseTimer.current), []);

	const openWidget = (widget) => {
		scenePausedRef.current = true;
		window.clearTimeout(widgetCloseTimer.current);
		setWidgetClosing(false);
		setSelectedWidget(widget);
	};

	const closeWidget = () => {
		if (!selectedWidget || widgetClosing) return;
		setWidgetClosing(true);
		widgetCloseTimer.current = window.setTimeout(() => {
			setSelectedWidget(null);
			setWidgetClosing(false);
			scenePausedRef.current = false;
		}, 220);
	};

	useEffect(() => {
		if (!selectedWidget) return undefined;

		const closeOnEscape = (event) => {
			if (event.key !== "Escape") return;
			setWidgetClosing(true);
			window.clearTimeout(widgetCloseTimer.current);
			widgetCloseTimer.current = window.setTimeout(() => {
				setSelectedWidget(null);
				setWidgetClosing(false);
				scenePausedRef.current = false;
			}, 220);
		};

		window.addEventListener("keydown", closeOnEscape);
		return () => window.removeEventListener("keydown", closeOnEscape);
	}, [selectedWidget]);

	const handleVisualPointerMove = (event) => {
		if (event.pointerType === "touch" || !visualRef.current) return;
		const bounds = visualRef.current.getBoundingClientRect();
		const pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
		const pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
		visualRef.current.style.setProperty("--parallax-near-x", `${(pointerX * 10).toFixed(2)}px`);
		visualRef.current.style.setProperty("--parallax-near-y", `${(pointerY * 8).toFixed(2)}px`);
		visualRef.current.style.setProperty("--parallax-far-x", `${(pointerX * -5).toFixed(2)}px`);
		visualRef.current.style.setProperty("--parallax-far-y", `${(pointerY * -4).toFixed(2)}px`);
		boardRef.current?.style.setProperty("--tilt-x", `${(pointerX * 3.5).toFixed(2)}deg`);
		boardRef.current?.style.setProperty("--tilt-y", `${(pointerY * -3).toFixed(2)}deg`);
	};

	const resetVisualPointer = () => {
		visualRef.current?.style.setProperty("--parallax-near-x", "0px");
		visualRef.current?.style.setProperty("--parallax-near-y", "0px");
		visualRef.current?.style.setProperty("--parallax-far-x", "0px");
		visualRef.current?.style.setProperty("--parallax-far-y", "0px");
		boardRef.current?.style.setProperty("--tilt-x", "0deg");
		boardRef.current?.style.setProperty("--tilt-y", "0deg");
	};

	const goTo = (destination, role = selectedRole?.name.toLowerCase()) => {
		setSelectedRole(null);
		localStorage.setItem("onboardx-role", role);
		navigate(destination, { state: { role } });
	};

	return (
		<main className="role-selection-page">
			<section className="role-showcase" aria-labelledby="showcase-title">
				<header className="showcase-brand">
					<span className="showcase-brand-mark" aria-hidden="true">OX</span>
					<span>OnboardX</span>
				</header>

				<div className="showcase-copy">
					<p className="showcase-eyebrow">PEOPLE FIRST. PROCESS READY.</p>
					<h1 id="showcase-title">Welcome to the Future of Employee Onboarding</h1>
					<p className="showcase-description">
						Bring every first-day detail into one clear, connected experience. Automate
						tasks, equip teams, and help every new colleague feel at home from day one.
					</p>
				</div>

				<div className="onboarding-visual" ref={visualRef} onPointerEnter={() => { scenePausedRef.current = true; }} onPointerMove={handleVisualPointerMove} onPointerLeave={() => { resetVisualPointer(); if (!selectedWidget) scenePausedRef.current = false; }} aria-label="Interactive onboarding workflow">
					<div className="visual-orbit visual-orbit-one" aria-hidden="true" />
					<div className="visual-orbit visual-orbit-two" aria-hidden="true" />
					<div className="visual-glass visual-glass-top" aria-hidden="true" />
					<div className="visual-glass visual-glass-bottom" aria-hidden="true" />
					<div className="visual-particles" aria-hidden="true">
						{Array.from({ length: 9 }, (_, index) => <span key={index} />)}
					</div>

					<div className="workflow-board" ref={boardRef}>
						<div className="workflow-board-topline">
							<span className="workflow-dot" />
							<span className="workflow-dot" />
							<span className="workflow-dot" />
							<span className="workflow-board-label">YOUR ONBOARDING JOURNEY</span>
						</div>
						<div className="scene-stage" key={activeScene}>
							{activeScene === 0 && (
								<button className="journey-scene onboarding-widget" type="button" onClick={() => openWidget("welcome")} aria-label="View Welcome Aboard details">
									<div className="scene-title-row"><span>Welcome Aboard</span><span className="scene-live"><i /> LIVE</span></div>
									<p className="scene-caption">A clear path from day one to fully onboarded.</p>
									<div className="progress-milestones">
										{["Profile", "Documents", "People", "Ready"].map((step, index) => <span key={step} className={`progress-milestone milestone-${index + 1}`}><i />{step}</span>)}
									</div>
									<div className="journey-progress-track"><span /></div>
									<div className="journey-progress-meta"><span>Onboarding progress</span><strong>25% <i>→</i> 100%</strong></div>
								</button>
							)}
							{activeScene === 1 && (
								<button className="profile-scene onboarding-widget" type="button" onClick={() => openWidget("profile")} aria-label="View Profile Setup details">
									<div className="scene-title-row"><span>Profile Setup</span><span className="document-counter">COMPLETE</span></div>
									<div className="profile-person-card">
										<div className="profile-avatar-large">JS</div>
										<div className="profile-person-copy"><strong>Jordan Smith</strong><span>Product Design · New starter</span></div>
										<span className="profile-card-spark">✦</span>
									</div>
									<div className="profile-complete-badge"><span>&#10003;</span><div><strong>Profile Completed</strong><small>All your details are in place</small></div></div>
									<div className="profile-lines"><i /><i /><i /></div>
								</button>
							)}
							{activeScene === 2 && (
								<button className="documents-scene onboarding-widget" type="button" onClick={() => openWidget("documents")} aria-label="View Document Verification details">
									<div className="scene-title-row"><span>Document Verification</span><span className="document-counter">03 / 03</span></div>
									<p className="scene-caption">Your essentials, securely in one place.</p>
									{["Aadhaar", "PAN", "Degree"].map((document, index) => <div className={`document-row document-row-${index + 1}`} key={document}><span className="document-file-icon">PDF</span><span className="document-name">{document}<small>Verified document</small></span><span className="document-check">&#10003;</span></div>)}
								</button>
							)}
							{activeScene === 3 && (
								<button className="provision-scene onboarding-widget" type="button" onClick={() => openWidget("provisioning")} aria-label="View IT Provisioning details">
									<div className="scene-title-row"><span>IT provisioning</span><span className="provision-status">IN PROGRESS</span></div>
									<p className="scene-caption">Everything Jordan needs to do great work.</p>
									{["Laptop Assigned", "Email Created", "VPN Enabled", "Access Granted"].map((task, index) => <div className={`provision-row provision-row-${index + 1}`} key={task}><span className="provision-icon">{["⌘", "@", "◉", "✓"][index]}</span><span>{task}</span><span className="provision-check">&#10003;</span></div>)}
								</button>
							)}
						</div>
					</div>

					<button className="workflow-insight" type="button" onClick={() => openWidget("access")} aria-label="View Access Management details">
						<span className="insight-spark" aria-hidden="true">&#10022;</span>
						<span><strong>Access Management</strong><small>One journey. Every team.</small></span>
					</button>

					{selectedWidget && (
						<div
							className={`emergence-stage${widgetClosing ? " is-closing" : ""}`}
							onMouseDown={(event) => { if (event.target === event.currentTarget) closeWidget(); }}
						>
							<section className="emergence-panel" role="dialog" aria-labelledby="emergence-title">
								<button className="emergence-close" type="button" aria-label="Close onboarding details" onClick={closeWidget}>&times;</button>
								<div className="emergence-heading">
									<span className="emergence-kicker">ONBOARDX · LIVE WORKFLOW</span>
									<h2 id="emergence-title">{onboardingDetails[selectedWidget].title}</h2>
								</div>
								<div className="emergence-cards">
									{onboardingDetails[selectedWidget].items.map((item, index) => (
										<div className={`emergence-card emergence-card-${index + 1}`} key={item} style={{ "--emergence-index": index }}>
											<span className="emergence-check" aria-hidden="true">&#10003;</span>
											<span>{item}</span>
											<span className="emergence-card-status">READY</span>
										</div>
									))}
								</div>
								<div className="emergence-footer">
									<div className="emergence-progress"><span>Progress</span><strong>{onboardingDetails[selectedWidget].progress}</strong></div>
									<div className="emergence-status"><i /><span>{onboardingDetails[selectedWidget].status}</span></div>
								</div>
							</section>
						</div>
					)}
				</div>

				<footer className="showcase-footer">
					<span>Built for better beginnings</span>
					<span className="showcase-footer-line" />
					<span>People operations, connected</span>
				</footer>
			</section>

			<aside className="role-access" aria-labelledby="role-title">
				<div className="role-selection-panel">
					<header className="role-selection-header">
						<div className="role-brand-mark" aria-hidden="true">OX</div>
						<p className="role-brand-name">ONBOARDX PORTAL</p>
						<h2 id="role-title">Welcome to OnboardX</h2>
						<p className="role-selection-subtitle">Select your role to continue</p>
					</header>

					<div className="role-selection-grid">
						{roles.map((role) => (
							<button
								className="role-option"
								key={role.name}
								type="button"
								onClick={() => setSelectedRole(role)}
							>
								<span className={`role-option-icon role-icon-${role.name.toLowerCase()}`} aria-hidden="true">
									{role.icon}
								</span>
								<span className="role-option-copy">
									<span className="role-option-name">{role.name}</span>
									<span className="role-option-detail">{role.detail}</span>
								</span>
								<span className="role-option-arrow" aria-hidden="true">&#8594;</span>
							</button>
						))}
					</div>

					<p className="role-selection-footer">Secure access to your OnboardX workspace</p>
				</div>
			</aside>

			{selectedRole && (
				<div className="role-dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedRole(null); }}>
					<section className="role-dialog" role="dialog" aria-modal="true" aria-labelledby="role-dialog-title">
						<button className="role-dialog-close" type="button" aria-label="Close role options" onClick={() => setSelectedRole(null)}>&times;</button>
						<div className={`role-dialog-icon role-icon-${selectedRole.name.toLowerCase()}`} aria-hidden="true">{selectedRole.icon}</div>
						<p className="role-dialog-eyebrow">ONBOARDX PORTAL</p>
						<h2 id="role-dialog-title">{selectedRole.name}</h2>
						<p className="role-dialog-subtitle">{selectedRole.workspace}</p>
						<div className="role-dialog-actions">
										<button className="dialog-primary-action" type="button" onClick={() => goTo("/signup")}>{selectedRole.name === "Intern" ? "Create Account" : "Create Official Account"}<span aria-hidden="true">&#8594;</span></button>
							<button className="dialog-secondary-action" type="button" onClick={() => goTo(selectedRole.destination)}>{selectedRole.name === "Intern" ? "Already Registered? Login" : "Login"}<span aria-hidden="true">&#8594;</span></button>
						</div>
						<p className="role-dialog-secure"><span aria-hidden="true">&#10003;</span> Secure access to your workspace</p>
					</section>
				</div>
			)}

		</main>
	);
}

export default RoleSelection;
