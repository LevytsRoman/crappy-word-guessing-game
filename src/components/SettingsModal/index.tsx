import './index.scss';
import Modal from '../Modal';

export type SettingsType = {
  hardMode: boolean;
  wordLength: number;
};

type ModalProps = {
  showSettings: boolean;
  settings: SettingsType;
  gameOver: boolean;
  setSettings: (settings: any) => void;
  closeModal: () => void;
};

export default function SettingsModal({
  showSettings,
  settings,
  gameOver,
  closeModal,
  setSettings,
}: ModalProps) {
  return (
    <Modal open={showSettings} closeModal={closeModal}>
      <div className="modal-section">
        <h2 className="modal-heading">Settings</h2>
        <label>
          <input
            disabled={!gameOver}
            type="checkbox"
            name="hard_mode"
            checked={settings.hardMode}
            onChange={() =>
              setSettings({ ...settings, hardMode: !settings.hardMode })
            }
          />
          Hard mode
        </label>
        <select
          name="wordLength"
          value={settings.wordLength}
          onChange={(e) =>
            setSettings({ ...settings, wordLength: parseInt(e.target.value) })
          }
        >
          <option value={5}>5</option>
          <option value={6}>6</option>
        </select>
      </div>
    </Modal>
  );
}
