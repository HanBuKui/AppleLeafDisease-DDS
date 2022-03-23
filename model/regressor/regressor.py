
# %% [markdown]
# # 一种基于Super Learner的苹果褐斑病发病期集成预测模型 

# %%
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.preprocessing import OneHotEncoder
from sklearn.preprocessing import StandardScaler
from sklearn.tree import DecisionTreeRegressor
from sklearn.neural_network import MLPRegressor
from minepy import MINE
from collections import defaultdict
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression, Lasso, Ridge, ElasticNet
from sklearn.svm import SVR
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor
from lightgbm import LGBMRegressor
from mlens.ensemble import SuperLearner
from sklearn.metrics import mean_squared_error, r2_score
from ray import tune
import xgboost as xgb
from xgboost import XGBRegressor
from ray.tune.schedulers import ASHAScheduler

plt.style.use(['science', 'ieee', 'grid', 'muted'])

# %% [markdown]
# ## 1.加载数据

# %%
data = pd.read_csv('data.csv', header=0, encoding='gb2312')
data.drop(['year'], axis=1, inplace=True)
columns = data.columns

df = pd.DataFrame.from_records(
    data=data.values,
    columns=columns)
df


# %%

columns.tolist()


# %%
X = df.iloc[:, :-1]
y = df.iloc[:, -1]

assert X.shape[0] == y.shape[0], 'Shape dismatched!'

# %% [markdown]
# ## 2.特征工程
# %% [markdown]
# ### 2.1 特征处理
# %% [markdown]
# #### 2.1.1 标准化
# %% [markdown]
# #### 2.1.2 特征选择

# %%
def cal_mic(x, y):
    '''
    最大信息系数
    '''
    m = MINE()
    m.compute_score(x, y)

    return m.mic()


def cal_mics(dfx, y):
    ''' 
    dfx: dataframe
    y:series
    '''
    return dfx.apply(lambda x: cal_mic(x, y))


def mRMR(dfx, y, n):
    ''' 最小冗余最大相关
    n: 待选的特征数
    '''
    # 记录已经选择的列
    selected = []
    # 记录特征MIC
    mic_dict = {}

    # 计算相关
    relevances = cal_mics(dfx, y)
    print(' 与y的关联性：\n{}'.format(relevances))

    last_sel = relevances.idxmax()
    selected.append(last_sel)
    relevances = relevances.to_dict()
    print('     选中：{}'.format(last_sel))
    # 冗余-初始化为0.0
    redundances = defaultdict(float)

    while len(selected) < dfx.shape[0] and len(selected) < n:
        mr = -np.inf
        new_sel = None
        for cc in dfx.columns:
            if cc not in selected:
                redundances[cc] += cal_mic(dfx[cc], dfx[last_sel])
                # 综合考虑相关性和冗余性
                _mrmr = relevances[cc] - (redundances[cc] / len(selected))
                if _mrmr > mr:
                    mr == _mrmr
                    new_sel = cc
        print('     选中：{}'.format(new_sel))
        selected.append(new_sel)
        last_sel = new_sel
    print('x的冗余性：\n{}'.format(redundances))
    return selected, redundances, relevances


# %%
n_select = 12
selected_features, redundances, relevances = mRMR(df.drop('日序', axis=1), df['日序'], n_select)
X = df[selected_features]

selected_features


# %%
X = StandardScaler().fit_transform(X)

X

# %% [markdown]
# #### 2.2.3 划分数据集

# %%
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

X_train.shape

# %% [markdown]
# ## 3.模型
# %% [markdown]
# ### 3.1 单个模型
# %% [markdown]
# #### 3.1.1 线性模型
# %% [markdown]
# 线性回归

# %%
lr = LinearRegression().fit(X_train, y_train)
y_preds = lr.predict(X_test)

mse = mean_squared_error(y_test, y_preds)
r2 = r2_score(y_test, y_preds)
msg = 'LinearRegression: MSE: {}, R2: {}\n'.format(mse, r2)
print(msg)
with open('logs/result.txt', 'a+') as result:
    result.write(msg)

# %% [markdown]
# Lasso回归

# %%
lasso = Lasso().fit(X_train, y_train)
y_preds = lasso.predict(X_test)

mse = mean_squared_error(y_test, y_preds)
r2 = r2_score(y_test, y_preds)
msg = 'Lasso: MSE: {}, R2: {}\n'.format(mse, r2)
print(msg)
with open('logs/result.txt', 'a+') as result:
    result.write(msg)

# %% [markdown]
# Ridge回归

# %%
ridge = Ridge().fit(X_train, y_train)
y_preds = ridge.predict(X_test)

mse = mean_squared_error(y_test, y_preds)
r2 = r2_score(y_test, y_preds)

msg = 'Ridge: MSE: {}, R2: {}\n'.format(mse, r2)
print(msg)
with open('logs/result.txt', 'a+') as result:
    result.write(msg)

# %% [markdown]
# ElasticNet回归

# %%
en = ElasticNet().fit(X_train, y_train)
y_preds = en.predict(X_test)

mse = mean_squared_error(y_test, y_preds)
r2 = r2_score(y_test, y_preds)
print('MSE: {}, R2: {}'.format(mse, r2))

# %% [markdown]
# （2）支持向量机

# %%
svr = SVR(kernel='linear', C=1e-3)
svr.fit(X_train, y_train)
y_preds = svr.predict(X_test)

mse = mean_squared_error(y_test, y_preds)
r2 = r2_score(y_test, y_preds)

msg = 'SVR: MSE: {}, R2: {}\n'.format(mse, r2)
print(msg)
with open('logs/result.txt', 'a+') as result:
    result.write(msg)


# %%
best_params = tune_model.get_best_config(metric='r2_score')
print('Best config is: ', best_params)

# %% [markdown]
# #### 3.1.2 树模型
# %% [markdown]
# (1) 决策树

# %%
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)

dt = DecisionTreeRegressor().fit(X_train, y_train)
y_preds = dt.predict(X_test)

mse = mean_squared_error(y_test, y_preds)
r2 = r2_score(y_test, y_preds)

msg = 'DecisionTreeRegressor: MSE: {}, R2: {}\n'.format(mse, r2)
print(msg)
with open('logs/result.txt', 'a+') as result:
    result.write(msg)

# %% [markdown]
# （3）随机森林

# %%
rfr = RandomForestRegressor().fit(X_train, y_train)
y_preds = rfr.predict(X_test)

mse = mean_squared_error(y_test, y_preds)
r2 = r2_score(y_test, y_preds)

print('RandomForestRegressor: MSE: {}, R2: {}\n'.format(mse, r2))
print(rfr.feature_importances_)


# %%
def xgbr_tune(config):
    # 每次随机划分
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = XGBRegressor(**config)

    model.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)

    y_preds = model.predict(X_test)

    tune.track.log(r2_score=r2_score(y_test, y_preds), done=True)

config = {
    'n_estimators': tune.randint(100, 1000),
    'colsample_bytree': tune.choice([0.4, 0.6, 0.7, 0.8, 0.9, 1.0]),
    'gamma': tune.uniform(0, 1.0),
    'learning_rate': tune.choice([0.01, 0.015, 0.025, 0.05, 0.1]),
    'max_depth': tune.choice([3, 5, 7, 9, 12, 15, 17, 25]),
    'min_child_weight': tune.choice([1, 3, 5, 7]),
    'reg_alpha': tune.choice([0, 0.1, 0.5, 1.0]),
    'reg_lambda': tune.uniform(0, 1.0),
    'subsample': tune.uniform(0.5, 1.0)
}

tune_model = tune.run(
    xgbr_tune,  # 已定义好的模型结构
    resources_per_trial={'cpu': 32, 'gpu': 1},  # 每轮使用cpu的数量
    config=config,  # 参数空间
    num_samples=10,  # 运行Trails的（外层的）次数
    # 超参数优化器 ASHAScheduler：异步Successive Halving优化算法的实现
    # log损失，metric按min方向优化
    scheduler=ASHAScheduler(metric='eval-logloss', mode='min')
)


# %%
best_params = tune_model.get_best_config(metric='r2_score')
print('Best config is: ', best_params)


# %%
model = XGBRegressor()

model.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)

y_preds = model.predict(X_test)

mse = mean_squared_error(y_test, y_preds)
r2 = r2_score(y_test, y_preds)
print('XGBRegressor: MSE: {}, R2: {}\n'.format(mse, r2))

# %% [markdown]
# ### 3.2 集成模型

# %%
def bulid_super_learner(df,
                        base_models,
                        meta_model,
                        score_fun,
                        kfolds=5,
                        random_state=None):
    '''使用ML-Ensemble库实现Super Learner'''
    X, y = df.iloc[:, :-1].values, df.iloc[:, -1].values
    X_train, X_test, y_train, y_test = train_test_split(X,
                                                        y,
                                                        test_size=0.2,
                                                        random_state=42)
    # 创建SuperLearner
    ensemble = SuperLearner(scorer=score_fun,
                            folds=kfolds,
                            shuffle=True,
                            sample_size=len(X),
                            random_state=random_state)
    # 基模型
    ensemble.add(base_models)
    # 元模型
    ensemble.add_meta(meta_model)
    # 训练集成模型
    ensemble.fit(X, y)
    # 预测
    preds = ensemble.predict(X)
    # 评估
    msg = 'Super Learner Train MSE {}, R2: {}\n'.format(
        mean_squared_error(y, preds), r2_score(y, preds))
    with open('logs/result.txt', 'a+') as result:
        result.write(msg)
    print(msg)
    # 返回训练好的集成模型
    return ensemble


X_train, X_validate, y_train, y_validate = train_test_split(X,
                                                            y,
                                                            test_size=0.2,
                                                            random_state=42)

base_models = [
    RandomForestRegressor(),
    XGBRegressor(),
    LGBMRegressor()
]
meta_model = LinearRegression()

clf = bulid_super_learner(df,
                          base_models,
                          meta_model,
                          mean_squared_error,
                          kfolds=3,
                          random_state=None)

# %% [markdown]
# 特征重要度分析

# %%
models = [XGBRegressor, RandomForestRegressor(), LGBMRegressor()]
scores = []
for model in models:
    model = RandomForestRegressor().fit(X, y)
    scores.append(model.feature_importances_.tolist())
scores


# %%
from sklearn.preprocessing import MinMaxScaler

scaled_scores = []
sc = MinMaxScaler()

scaled_scores.append([sc.fit_transform(np.array(score).reshape(-1, 1)) for score in scores])
avg = np.mean(scaled_scores, axis=1).tolist()
scores.append(avg[0])
scores


# %%
names = ['XGBoost', 'RF', 'LightGBM', 'Average']
x = ['Var {}'.format(i) for i in range(1, len(scores[0])+1)]
scores[-1] = [score[0] for score in scores[-1]]
for i, score in enumerate(scores):
    plt.figure(figsize=(8, 8))
    plt.bar(x, score, label=names[i])
    plt.legend()
    plt.savefig('logs/{}.jpg'.format(names[i]))
    plt.show()