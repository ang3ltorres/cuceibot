import type { FunctionalComponent } from "preact";
import "./Popup.css";

interface PopupProps {
	open: boolean;
	title?: string;
	message: string;
	buttonLabel?: string;
	onClose: () => void;
}

const Popup: FunctionalComponent<PopupProps> = ({
	open,
	title,
	message,
	buttonLabel = "Cerrar",
	onClose,
}) => {
	if (!open) return null;

	return (
		<div class="popup-overlay" role="presentation" onClick={onClose}>
			<div
				class="popup-container"
				role="alertdialog"
				aria-modal="true"
				onClick={(e) => e.stopPropagation()}
			>
				<h2 class="popup-title">{title}</h2>
				<p class="popup-message">{message}</p>
				<button class="popup-button" type="button" onClick={onClose}>
					{buttonLabel}
				</button>
			</div>
		</div>
	);
};

export default Popup;
