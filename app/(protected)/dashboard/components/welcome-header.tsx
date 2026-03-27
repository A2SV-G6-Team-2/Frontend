import Icon from '../../../../components/icon';

export default function WelcomeHeader({ username, onAddClick }: { username: string, onAddClick?: () => void }) {
    return (
        <div className="flex justify-between">
            <div>
                <h1 className="text-3xl font-bold">Welcome Back, {username}&nbsp;!</h1>
            </div>
            <div>
                <button 
                    type="button" 
                    onClick={onAddClick}
                    className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-base font-medium text-white shadow-lg shadow-accent/30 transition-all hover:scale-105 hover:bg-accent/95 hover:shadow-accent/40 cursor-pointer"
                >
                    <Icon src="/img/icons/plus.svg"></Icon>
                    Add Transaction
                </button>
            </div>
        </div>
    );
}
