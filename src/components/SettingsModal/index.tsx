import './index.scss';
import Modal from '../Modal';

export type SettingsType = {
  hardMode: boolean;
};

type ModalProps = {
  showSettings: boolean;
  settings: SettingsType;
  setSettings: (settings: any) => void;
  closeModal: () => void;
};

export default function SettingsModal({
  showSettings,
  settings,
  closeModal,
  setSettings,
}: ModalProps) {
  return (
    <Modal open={showSettings} closeModal={closeModal}>
      <div className="modal-section">
        <h2>Settings</h2>
        <label>
          <input
            type="checkbox"
            name="hard_mode"
            checked={settings.hardMode}
            onChange={() =>
              setSettings({ ...settings, hardMode: !settings.hardMode })
            }
          />
          Hard mode
        </label>
      </div>
    </Modal>
  );
}
