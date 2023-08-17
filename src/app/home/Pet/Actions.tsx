"use client";

export interface ActionsProps {}

export function Actions(props: ActionsProps) {
  return (
    <div className="nes-container with-title flex-1 bg-white">
      <p className="title">Actions</p>
      <div className="flex gap-12 justify-between h-full">
        <div className="flex flex-col flex-shrink-0 gap-1">
          <label>
            <input type="radio" className="nes-radio" name="action" />
            <span>Feed</span>
          </label>
          <label>
            <input type="radio" className="nes-radio" name="action" />
            <span>Play</span>
          </label>
          <label>
            <input type="radio" className="nes-radio" name="action" />
            <span>Customize</span>
          </label>
        </div>
        <div className="w-1 h-full bg-zinc-300 flex-shrink-0" />
        <div className="flex flex-col gap-1 justify-between">
          <p>This action does something blah blah blah placeholder text...</p>
          <button type="button" className="nes-btn is-success">
            Start
          </button>
        </div>
      </div>
    </div>
  );
}
