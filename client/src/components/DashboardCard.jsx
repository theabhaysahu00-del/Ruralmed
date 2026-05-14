import { useNavigate } from 'react-router-dom';

const DashboardCard = ({ title, hindi, icon: Icon, color = 'primary', onClick, description, link }) => {
  const navigate = useNavigate();
  const colorClasses = {
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-white',
    accent: 'bg-amber-500 text-white',
    emergency: 'bg-red-600 text-white',
    soft: 'bg-surface-low text-primary border border-primary/5'
  };

  const handleClick = () => {
    if (onClick) onClick();
    if (link) navigate(link);
  };

  return (
    <div 
      onClick={handleClick}
      className={`p-6 rounded-3xl cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] shadow-organic dark:shadow-none group relative overflow-hidden ${colorClasses[color]} ${color === 'soft' ? 'dark:bg-surface/5 dark:border-primary/10 dark:text-on-surface' : ''}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-4 rounded-2xl ${color === 'soft' ? 'bg-primary/10' : 'bg-white/20 backdrop-blur-sm'}`}>
          <Icon className="w-8 h-8" />
        </div>
      </div>
      
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-xl font-display leading-tight">{title}</h3>
        </div>
        {hindi && <p className="text-sm opacity-90 font-medium mb-2">{hindi}</p>}
        {description && <p className="text-xs opacity-75 line-clamp-2 leading-relaxed">{description}</p>}
      </div>

      {color !== 'soft' && (
        <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
          <Icon className="w-24 h-24" />
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
